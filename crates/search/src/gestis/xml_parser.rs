use std::str;

use quick_xml::Reader;

use super::{
  error::Result,
  functions::{parse_chapters, ReaderExt},
  types::{GestisResponse, ParsedData},
};

pub fn parse_response(json: &GestisResponse, fail_fast: bool) -> Result<ParsedData> {
  let mapping = parse_chapters(json);

  let (molecular_formula, molar_mass) =
    get_value(read_molecular_formula, mapping.molecular_formula, fail_fast)?.unwrap_or_default();

  Ok(ParsedData {
    cas: get_value(read_cas, mapping.cas_number, fail_fast)?,
    molecular_formula,
    molar_mass,
    melting_point: get_value(read_mp_bp, mapping.melting_point, fail_fast)?,
    boiling_point: get_value(read_mp_bp, mapping.boiling_point, fail_fast)?,
    water_hazard_class: get_value(read_whc, mapping.water_hazard_class, fail_fast)?,
    h_phrases: None,
    p_phrases: None,
    signal_word: None,
    symbols: None,
    lethal_dose: None,
    mak: None,
  })
}

fn get_value<T, F>(f: F, xml: Option<&str>, fail_fast: bool) -> Result<Option<T>>
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
      Err(err) => {
        log::error!("failed to parse gestis data: {err:?}");

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
  reader.read_to_end_unbuffered("td")?;
  reader.find_start("td")?;

  let molar_mass = reader.read_text_unbuffered("td")?;

  Ok((Some(molecular_formula), Some(molar_mass)))
}

fn read_mp_bp(mut reader: Reader<&[u8]>) -> Result<String> {
  reader.find_table("feldmitlabel")?;
  reader.find_start("td")?;
  reader.read_to_end_unbuffered("td")?;
  reader.find_start("td")?;

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
