/*
  This parser roughly does the following:
  1. take the JSON response and extract references to all chapters we need by traversing all available chapters (`functions::parse_chapters`)
  2. use a dedicated function for each chapter that extracts the necessary information with setup and error handling in `get_value`
     (there may be a more complicated logic, e.g. mak parsing
  3. pack all extracted information into a neat struct that can be used by the gestis handler to fill the SubstanceData struct

  We don't trust gestis so every single XML/HTML string is searched until the end for everything that looks like stuff we could use.
  This means, that every function starts with a definition of a `Vec` with some default capacity.
  If there is not comment above or behind the value is the maximum we saw in the wild, so if you find a higher value
  write change it (the values will be very low so the memory usage doesn't matter).

  If you are the poor soul who has to fix a bug or change something because the gestis API has changed look in the
  `contrib` folder in the search crate, I wrote a helper binary that has some useful features that eases the pain of
  reading a JSON response with XML/HTML strings a bit.
*/
use std::str;

use lazy_static::lazy_static;
use quick_xml::{
  events::{BytesStart, Event},
  Reader,
};
use regex::Regex;

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

  let (molecular_formula, molar_mass) = get_value(
    "read_molecular_formula",
    read_molecular_formula_molar_mass,
    mapping.molecular_formula_molar_mass,
    fail_fast,
  )?;

  let (h_phrases, p_phrases, symbols, signal_word) = get_value(
    "get_h_p_signal_symbols",
    get_h_p_signal_symbols,
    mapping.h_p_signal_symbols,
    fail_fast,
  )?;

  let mak = {
    let mak = get_value("read_mak(agw)", read_mak, mapping.agw, fail_fast);

    if mak.is_err() || mak.as_ref().unwrap().is_empty() {
      log::debug!("read_mak: AGW not available");
      get_value("read_mak(mak)", read_mak, mapping.mak, fail_fast)?
    } else {
      mak?
    }
  };

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

fn get_value<T, F>(name: &str, f: F, xml: Option<&str>, fail_fast: bool) -> Result<T>
where
  T: Default,
  F: Fn(Reader<&[u8]>) -> Result<T>,
{
  if let Some(xml) = xml {
    let mut reader = Reader::from_str(xml);
    reader.trim_text(true);
    // gestis responses are malformed anyway ¯\_(ツ)_/¯
    reader.check_end_names(false);

    match f(reader) {
      Ok(res) => Ok(res),
      Err(GestisError::MissingInfo(i)) => {
        log::warn!("missing info: {i}");

        Ok(T::default())
      }
      Err(err) => {
        log::error!("{name}: {err:?}");

        if fail_fast {
          Err(err)
        } else {
          Ok(T::default())
        }
      }
    }
  } else {
    Ok(T::default())
  }
}

fn read_cas(mut reader: Reader<&[u8]>) -> Result<Vec<String>> {
  let mut cas_numbers = Vec::with_capacity(2);

  loop {
    if let Event::Eof = reader.find_start("casnr")? {
      break;
    }

    cas_numbers.push(reader.read_text_unbuffered("casnr")?);
  }

  log::debug!("CAS: {cas_numbers:?}");

  Ok(cas_numbers)
}

fn read_molecular_formula_molar_mass(mut reader: Reader<&[u8]>) -> Result<(Vec<String>, Vec<String>)> {
  let mut molecular_formulas = Vec::with_capacity(2);
  let mut molar_mass_values = Vec::with_capacity(2);

  loop {
    match reader.read_event_unbuffered()? {
      Event::Start(e) => match e.name() {
        b"summenformel" => loop {
          match reader.read_event_unbuffered()? {
            Event::Text(t) => molecular_formulas.push(t.unescape_and_decode(&reader)?),
            Event::End(e) => {
              if e.name() == b"summenformel" {
                break;
              }
            }
            e => log::debug!("unexpected event: {e:?}"),
          }
        },
        b"b" => {
          if &reader.read_text_unbuffered("b")? == "Molmasse:" {
            reader.find_start("td")?;
            molar_mass_values.push(reader.read_text_unbuffered("td")?);
          }
        }
        _ => {}
      },
      Event::Eof => break,
      _ => {}
    }
  }

  log::debug!("molecular_formula: {molecular_formulas:?}");
  log::debug!("molar_mass: {molar_mass_values:?}");

  Ok((molecular_formulas, molar_mass_values))
}

fn read_mp_bp(mut reader: Reader<&[u8]>) -> Result<Vec<String>> {
  let mut mp_bps = Vec::with_capacity(2);

  loop {
    if Event::Eof == reader.find_table("feldmitlabel")? {
      break;
    }

    reader.find_start("td")?;
    reader.find_start("td")?; // skip to next one

    mp_bps.push(reader.read_text_unbuffered("td")?);
  }

  log::debug!("MP/BP: {mp_bps:?}");

  Ok(mp_bps)
}

/// Reads water hazard class
fn read_whc(mut reader: Reader<&[u8]>) -> Result<Vec<String>> {
  let mut water_hazard_classes = Vec::with_capacity(2);

  loop {
    match reader.read_event_unbuffered()? {
      Event::Start(e) => {
        if e.name() == b"td" {
          if let Ok(text) = reader.read_text_unbuffered("td") {
            if text.starts_with("WGK") {
              water_hazard_classes.push(text.split(' ').take(2).collect::<Vec<&str>>().join(" "));
            }
          }
        }
      }
      Event::Eof => break,
      _ => {}
    }
  }

  log::debug!("WHC: {water_hazard_classes:?}");

  Ok(water_hazard_classes)
}

type HPSignalSymbolsResult = Result<(
  Vec<Vec<(String, String)>>,
  Vec<Vec<(String, String)>>,
  Vec<Vec<String>>,
  Vec<String>,
)>;

fn get_h_p_signal_symbols(mut reader: Reader<&[u8]>) -> HPSignalSymbolsResult {
  // there shouldn't be more than two entries for each item
  let mut h_phrases = Vec::with_capacity(2);
  let mut p_phrases = Vec::with_capacity(2);
  let mut symbols = Vec::with_capacity(2);
  let mut signal_words = Vec::with_capacity(2);

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
            h_phrases.push(read_h_p_phrases(&mut reader)?);
          } else if name.ends_with(" P-Sätze:") {
            p_phrases.push(read_h_p_phrases(&mut reader)?);
          }
        }
        b"table" => {
          reader.find_start("td")?;
          reader.find_start("td")?; // skip to next one
          signal_words.push(reader.read_text_unbuffered("td")?.trim_matches('"').to_string());
        }
        _ => {}
      },
      Event::Empty(e) => {
        if e.name() == b"img" {
          symbols.push(get_ghs_symbols(&mut reader, e)?);
        }
      }
      Event::Text(e) => log::debug!("found text: {:?}", e.unescape_and_decode(&reader)),
      Event::Eof => break,
      e => return Err(GestisError::UnexpectedEvent(format!("{e:?}"))),
    }
  }

  log::debug!("h_phrases: {h_phrases:?}");
  log::debug!("p_phrases: {p_phrases:?}");
  log::debug!("symbols: {symbols:?}");
  log::debug!("signal_words: {signal_words:?}");

  Ok((h_phrases, p_phrases, symbols, signal_words))
}

fn get_ghs_symbols(reader: &mut Reader<&[u8]>, first: BytesStart) -> Result<Vec<String>> {
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
        if e.name() == b"img" {
          if let Some(symbol) = decode_attribute(e, reader)? {
            symbols.push(symbol);
          }
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
      Event::Start(b) => {
        if b.name() == b"verstecktercode" {
          reader.read_to_end_unbuffered("verstecktercode")?;
        } else {
          log::debug!("unexpected event: {:?}", Event::Start(b));
        }
      }
      e => log::debug!("unexpected event: {e:?}"),
    }
  }

  phrases.sort_unstable_by(|a, b| a.0.partial_cmp(&b.0).unwrap());

  Ok(phrases)
}

fn read_ld50(mut reader: Reader<&[u8]>) -> Result<Vec<String>> {
  let mut ld50_values = Vec::with_capacity(2); // mostly one or two values

  loop {
    if let Event::Eof = reader.find_start("b")? {
      break;
    }

    let text = reader.read_text_unbuffered("b")?;
    if &text == "LD50 oral Ratte" {
      reader.find_start("td")?;
      reader.find_start("td")?; // skip to next one

      ld50_values.push(reader.read_text_unbuffered("td")?);
    }
  }

  log::debug!("LD50: {ld50_values:?}");

  Ok(ld50_values)
}

fn read_mak(mut reader: Reader<&[u8]>) -> Result<Vec<String>> {
  lazy_static! {
    static ref MAK_RE: Regex = Regex::new(r"\d+[,.]\d+ (mg/m³|ppm)").unwrap();
  }

  let mut mak_values = Vec::with_capacity(2); // mostly just one or two

  loop {
    if Event::Eof == reader.find_start("td")? {
      break;
    }

    if let Ok(text) = reader.read_text_unbuffered("td") {
      if MAK_RE.is_match(&text) {
        mak_values.push(text);
      }
    }
  }

  log::debug!("MAK: {mak_values:?}");

  Ok(mak_values)
}
