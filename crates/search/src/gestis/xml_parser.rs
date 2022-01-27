use std::str;

use quick_xml::{
  events::{BytesStart, Event},
  Reader,
};

use super::{
  error::Result,
  functions::{parse_chapters, ReaderExt},
  types::{GestisResponse, ParsedData},
  GestisError,
};

pub fn parse_response(json: &GestisResponse, fail_fast: bool) -> Result<ParsedData> {
  let mapping = parse_chapters(json);

  let cas = get_value("read_cas", read_cas, mapping.cas_number, fail_fast)?;
  let melting_point = get_value("read_mp_bp", read_mp_bp, mapping.melting_point, fail_fast)?;
  let boiling_point = get_value("read_mp_bp", read_mp_bp, mapping.boiling_point, fail_fast)?;
  let water_hazard_class = get_value("read_whc", read_whc, mapping.water_hazard_class, fail_fast)?;
  let lethal_dose = get_value("read_ld50", read_ld50, mapping.lethal_dose, fail_fast)?;
  // let mak = get_value("read_mak", read_mak, mapping.mak1, fail_fast)?;
  let mak = None;

  let (molecular_formula, molar_mass) = get_value(
    "read_molecular_formula",
    read_molecular_formula,
    mapping.molecular_formula,
    fail_fast,
  )?
  .unwrap_or_default();

  let (h_phrases, p_phrases, symbols, signal_word) = get_value(
    "get_h_p_signal_symbols",
    get_h_p_signal_symbols,
    mapping.h_p_signal_symbols,
    fail_fast,
  )?
  .unwrap_or_default();

  Ok(ParsedData {
    cas,
    molecular_formula,
    molar_mass,
    melting_point,
    boiling_point,
    water_hazard_class,
    h_phrases,
    p_phrases,
    signal_word,
    symbols,
    lethal_dose,
    mak,
  })
}

fn get_value<T, F>(name: &str, f: F, xml: Option<&str>, fail_fast: bool) -> Result<Option<T>>
where
  F: Fn(Reader<&[u8]>) -> Result<T>,
{
  if let Some(xml) = xml {
    let mut reader = Reader::from_str(xml);
    reader.trim_text(true);
    // gestis responses are malformed anyway ¯\_(ツ)_/¯
    reader.check_end_names(false);

    match f(reader) {
      Ok(res) => Ok(Some(res)),
      Err(GestisError::MissingInfo(i)) => {
        log::warn!("missing info: {i}");

        Ok(None)
      }
      Err(err) => {
        log::error!("{name}: {err:?}");

        if fail_fast {
          Err(err)
        } else {
          Ok(None)
        }
      }
    }
  } else {
    Ok(None)
  }
}

fn read_cas(mut reader: Reader<&[u8]>) -> Result<String> {
  reader.find_start("casnr")?;

  let cas = reader.read_text_unbuffered("casnr")?;

  // TODO check for end/more cas numbers

  Ok(cas)
}

fn read_molecular_formula(mut reader: Reader<&[u8]>) -> Result<(Option<String>, Option<String>)> {
  reader.find_start("summenformel")?;

  let molecular_formula = reader.read_text_unbuffered("summenformel")?;

  reader.find_table("feldmitlabel")?;
  reader.find_start("td")?;
  reader.read_to_end_unbuffered("td")?; // TODO: remove?
  reader.find_start("td")?;

  let molar_mass = reader.read_text_unbuffered("td")?;

  Ok((Some(molecular_formula), Some(molar_mass)))
}

fn read_mp_bp(mut reader: Reader<&[u8]>) -> Result<String> {
  if Event::Eof == reader.find_table("feldmitlabel")? {
    return Err(GestisError::MissingInfo("melting- or boiling-point"));
  }
  reader.find_start("td")?;
  reader.find_start("td")?; // skip to next one

  let mp_bp = reader.read_text_unbuffered("td")?;

  Ok(mp_bp)
}

/// Reads water hazard class
fn read_whc(mut reader: Reader<&[u8]>) -> Result<String> {
  reader.find_table("block")?;
  reader.find_start("tr")?;
  reader.read_to_end_unbuffered("tr")?;
  reader.find_start("td")?;

  let whc = reader.read_text_unbuffered("tr")?;

  Ok(whc.split(' ').take(2).collect::<Vec<&str>>().join(" "))
}

type HPSignalSymbolsResult = Result<(
  Option<Vec<(String, String)>>,
  Option<Vec<(String, String)>>,
  Option<Vec<String>>,
  Option<String>,
)>;

fn get_h_p_signal_symbols(mut reader: Reader<&[u8]>) -> HPSignalSymbolsResult {
  let mut h_phrases = None;
  let mut p_phrases = None;
  let mut symbols = None;
  let mut signal_word = None;

  loop {
    if Event::Eof == reader.find_table("block")? {
      break;
    };
    reader.find_start("td")?;

    match reader.read_event_unbuffered()? {
      Event::Start(e) => match e.name() {
        b"b" => {
          let name = reader.read_text_unbuffered("b")?;

          if name.ends_with(" H-Sätze:") {
            h_phrases = Some(read_h_p_phrases(&mut reader)?);
          } else if name.ends_with(" P-Sätze:") {
            p_phrases = Some(read_h_p_phrases(&mut reader)?);
          }
        }
        b"table" => {
          reader.find_start("td")?;
          reader.find_start("td")?; // skip to next one
          signal_word = Some(reader.read_text_unbuffered("td")?.trim_matches('"').to_string());
        }
        _ => {}
      },
      Event::Empty(e) => {
        if e.name() == b"img" {
          symbols = Some(get_ghs_symbols(&mut reader, e)?);
        }
      }
      Event::Text(e) => log::debug!("found text: {:?}", reader.decode(e.escaped())),
      Event::Eof => break,
      e => return Err(GestisError::UnexpectedEvent(format!("{e:?}"))),
    }
  }

  Ok((h_phrases, p_phrases, symbols, signal_word))
}

fn get_ghs_symbols(reader: &mut Reader<&[u8]>, first: BytesStart) -> Result<Vec<String>> {
  log::trace!("get ghs symbols");

  #[inline(always)]
  fn decode_attribute(b: BytesStart, reader: &Reader<&[u8]>) -> Result<Option<String>> {
    let symbol = b.try_get_attribute("alt")?;
    log::debug!("src: '{:?}', alt: '{symbol:?}'", b.try_get_attribute("src")?);

    Ok(if let Some(s) = symbol {
      Some(reader.decode(&s.value)?.to_string())
    } else {
      None
    })
  }

  // there are never all 9 ghs symbols at the same time so with this we would reallocate at most once
  let mut symbols = Vec::with_capacity(4);

  if let Some(symbol) = decode_attribute(first, reader)? {
    symbols.push(symbol);
  }

  loop {
    match reader.read_event_unbuffered()? {
      Event::Empty(e) => {
        if let Some(symbol) = decode_attribute(e, reader)? {
          symbols.push(symbol);
        }
      }
      Event::End(e) => {
        if e.name() == b"tr" {
          break;
        }
      }
      Event::Eof => break,
      _ => {}
    }
  }

  symbols.sort_unstable();

  Ok(symbols)
}

fn read_h_p_phrases(reader: &mut Reader<&[u8]>) -> Result<Vec<(String, String)>> {
  let mut phrases = Vec::with_capacity(5); // some random default, may be changed in the future

  reader.find_start("td")?;
  loop {
    match reader.read_event_unbuffered()? {
      Event::End(e) => {
        if e.name() == b"td" {
          break;
        }
      }
      Event::Eof => break,
      Event::Text(t) => {
        if let Some((number, phrase)) = t.unescape_and_decode(reader)?.split_once(": ") {
          phrases.push((number.to_string(), phrase.to_string()));
        } else {
          log::debug!("wrongly formatted phrase: {t:?}");
        }
      }
      Event::Empty(_) => {}
      e => log::debug!("unexpected event: {e:?}"),
    }
  }

  phrases.sort_unstable_by(|a, b| a.0.partial_cmp(&b.0).unwrap());

  Ok(phrases)
}

fn read_ld50(mut reader: Reader<&[u8]>) -> Result<String> {
  loop {
    if let Event::Eof = reader.find_start("b")? {
      break;
    }

    let text = reader.read_text_unbuffered("b")?;
    if &text == "LD50 oral Ratte" {
      reader.find_start("td")?;
      reader.find_start("td")?; // skip to next one

      return reader.read_text_unbuffered("td");
    }

    // TODO check for more LD50 values
  }

  Err(GestisError::MissingInfo("LD50"))
}

fn read_mak(mut reader: Reader<&[u8]>) -> Result<String> {
  Err(GestisError::NoXML)
}
