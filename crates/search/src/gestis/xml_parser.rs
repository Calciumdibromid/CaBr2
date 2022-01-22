use std::str;

use quick_xml::{events::Event, Reader};

use super::{
  error::{GestisError, Result},
  types::{ChapterMapping, GestisResponse, ParsedData},
};

pub fn parse_response(json: &GestisResponse) -> Result<ParsedData> {
  let mapping = parse_chapters(json);

  Ok(ParsedData {
    cas: get_value(read_cas, mapping.cas_number)?,
    molecular_formula: None,
    molar_mass: None,
    melting_point: None,
    boiling_point: None,
    water_hazard_class: None,
    h_phrases: None,
    p_phrases: None,
    signal_word: None,
    symbols: None,
    lethal_dose: None,
    mak: None,
  })
}

fn get_value<T, F>(f: F, xml: Option<&str>) -> Result<Option<T>>
where
  F: Fn(&str) -> Result<T>,
{
  if let Some(xml) = xml {
    Ok(Some(f(xml)?))
  } else {
    Ok(None)
  }
}

fn read_cas(xml: &str) -> Result<String> {
  let mut reader = Reader::from_str(xml);
  reader.trim_text(true);

  skip(&mut reader, 5)?;
  find_start(&mut reader, "casnr")?;

  let cas = get_text(&mut reader, "casnr")?;

  // TODO check for end

  Ok(cas)
}

pub fn parse_chapters(json: &GestisResponse) -> ChapterMapping {
  let mut mapping = ChapterMapping {
    boiling_point: None,
    cas_number: None,
    h_p_signal_symbols: None,
    lethal_dose: None,
    mak1: None,
    mak2: None,
    melting_point: None,
    molecular_formula: None,
    water_hazard_class: None,
  };

  for chapter in json.chapters.iter() {
    match chapter.number.as_str() {
      "0100" => {
        for subchapter in chapter.subchapters.iter() {
          if subchapter.number.as_str() == "0100" {
            mapping.cas_number = subchapter.text.as_deref();
          }
        }
      }
      "0400" => {
        for subchapter in chapter.subchapters.iter() {
          if subchapter.number.as_str() == "0400" {
            mapping.molecular_formula = subchapter.text.as_deref();
          }
        }
      }
      "0500" => {
        for subchapter in chapter.subchapters.iter() {
          if subchapter.number.as_str() == "0501" {
            mapping.lethal_dose = subchapter.text.as_deref();
          }
        }
      }
      "0600" => {
        for subchapter in chapter.subchapters.iter() {
          match subchapter.number.as_str() {
            "0602" => mapping.melting_point = subchapter.text.as_deref(),
            "0603" => mapping.boiling_point = subchapter.text.as_deref(),
            _ => {}
          }
        }
      }
      "1100" => {
        for subchapter in chapter.subchapters.iter() {
          match subchapter.number.as_str() {
            "1106" => mapping.water_hazard_class = subchapter.text.as_deref(),
            "1201" => mapping.mak1 = subchapter.text.as_deref(),
            "1203" => mapping.mak2 = subchapter.text.as_deref(),
            "1303" => mapping.h_p_signal_symbols = subchapter.text.as_deref(),
            _ => {}
          }
        }
      }
      _ => {}
    }
  }

  mapping
}

fn skip(reader: &mut Reader<&[u8]>, times: u8) -> Result<()> {
  for _ in 0..times {
    match reader.read_event_unbuffered()? {
      Event::Start(e) => {
        reader.read_to_end_unbuffered(e.name())?;
      }
      e => return Err(GestisError::UnexpectedEvent(format!("{e:?}"))),
    }
  }

  Ok(())
}

fn find_start(reader: &mut Reader<&[u8]>, name: &str) -> Result<()> {
  let name: &[u8] = name.as_ref();
  loop {
    match reader.read_event_unbuffered()? {
      Event::Start(e) => {
        if e.name() == name {
          break;
        }
      }
      Event::Eof => return Err(GestisError::UnexpectedEvent(format!("{:?}", Event::Eof))),
      _ => {}
    }
  }

  Ok(())
}

fn get_text(reader: &mut Reader<&[u8]>, name: &str) -> Result<String> {
  Ok(reader.read_text(name, &mut Vec::with_capacity(32))?)
}

#[cfg(test)]
mod tests {
  use std::{fs::File, io::BufReader};

  use crate::gestis::types::{GestisResponse, ParsedData};

  use super::parse_response;

  fn load_substance_json(path: &str) -> GestisResponse {
    let file = File::open(path).unwrap();
    let reader = BufReader::new(file);
    serde_json::from_reader(reader).unwrap()
  }

  #[allow(clippy::too_many_arguments)]
  fn make_parsed_data(
    cas: Option<&str>,
    molecular_formula: Option<&str>,
    molar_mass: Option<&str>,
    melting_point: Option<&str>,
    boiling_point: Option<&str>,
    water_hazard_class: Option<&str>,
    h_phrases: Option<&[(&str, &str)]>,
    p_phrases: Option<&[(&str, &str)]>,
    signal_word: Option<&str>,
    symbols: Option<&[&str]>,
    lethal_dose: Option<&str>,
    mak: Option<&str>,
  ) -> ParsedData {
    ParsedData {
      cas: cas.map(String::from),
      molecular_formula: molecular_formula.map(String::from),
      molar_mass: molar_mass.map(String::from),
      melting_point: melting_point.map(String::from),
      boiling_point: boiling_point.map(String::from),
      water_hazard_class: water_hazard_class.map(String::from),
      h_phrases: h_phrases.map(map_phrases),
      p_phrases: p_phrases.map(map_phrases),
      signal_word: signal_word.map(String::from),
      symbols: symbols.map(|v| v.iter().map(|s| s.to_string()).collect()),
      lethal_dose: lethal_dose.map(String::from),
      mak: mak.map(String::from),
    }
  }

  fn map_phrases(phrases: &[(&str, &str)]) -> Vec<(String, String)> {
    phrases.iter().map(|(n, p)| (n.to_string(), p.to_string())).collect()
  }

  #[test]
  fn test_parsing_cobaltdinitrat() {
    assert_eq!(
      make_parsed_data(
        Some("10141-05-6"),
        Some("Co(NO3)2"),
        Some("182,95 g/mol"),
        None,
        None,
        Some("WGK 3"),
        Some(&[("H272", "Kann Brand verstärken; Oxidationsmittel."), ("H302", "Gesundheitsschädlich bei Verschlucken."), ("H332", "Gesundheitsschädlich bei Einatmen."), ("H317", "Kann allergische Hautreaktionen verursachen."), ("H318", "Verursacht schwere Augenschäden."), ("H334", "Kann bei Einatmen Allergie, asthmaartige Symptome oder Atembeschwerden verursachen."), ("H350i", "Kann bei Einatmen Krebs erzeugen."), ("H341", "Kann vermutlich genetische Defekte verursachen."), ("H360F", "Kann die Fruchtbarkeit beeinträchtigen."), ("H410", "Sehr giftig für Wasserorganismen mit langfristiger Wirkung.")]),
        Some(&[("P210", "Von Hitze, heißen Oberflächen, Funken, offenen Flammen sowie anderen Zündquellen fernhalten. Nicht rauchen."), ("P280", "Schutzhandschuhe/Schutzkleidung/Augenschutz/Gesichtsschutz tragen."), ("P301+P330+P331", "BEI VERSCHLUCKEN: Mund ausspülen. KEIN Erbrechen herbeiführen."), ("P302+P352", "BEI BERÜHRUNG MIT DER HAUT: Mit viel Wasser und Seife waschen."), ("P304+P340", "BEI EINATMEN: Die Person an die frische Luft bringen und für ungehinderte Atmung sorgen."), ("P305+P351+P338", "BEI KONTAKT MIT DEN AUGEN: Einige Minuten lang behutsam mit Wasser spülen. Eventuell vorhandene Kontaktlinsen nach Möglichkeit entfernen. Weiter spülen."), ("P310", "Sofort GIFTINFORMATIONSZENTRUM oder Arzt anrufen.")]),
        Some("Gefahr"),
        Some(&["ghs03", "ghs08", "ghs05", "ghs07", "ghs09"]),
        Some(" 691 mg/kg"),
        None
      ),
      parse_response(&load_substance_json("tests/assets/cobaltdinitrat.json")).unwrap()
    )
  }

  #[test]
  fn test_parsing_calcium() {
    assert_eq!(
      make_parsed_data(
        Some("7440-70-2"),
        Some("Ca"),
        None, // Some("40,08 g/mol"),
        Some("839\u{a0}...\u{a0} 841 °C"),
        Some("1484 °C"),
        Some("WGK 1"),
        Some(&[("H261", "In Berührung mit Wasser entstehen entzündbare Gase.")]),
        Some(&[("P223", "Keinen Kontakt mit Wasser zulassen."), ("P232", "Vor Feuchtigkeit schützen."), ("P501", "Entsorgung des Inhalts / des Behälters gemäß den örtlichen / regionalen / nationalen / internationalen Vorschriften."), ("P402+P404", "An einem trockenen Ort aufbewahren. In einem geschlossenen Behälter aufbewahren.")]),
        Some("Gefahr"),
        Some(&["ghs02"]),
        None,
        None,
      ),
      parse_response(&load_substance_json("tests/assets/calcium.json")).unwrap()
    )
  }

  #[test]
  fn test_parsing_bananenöl() {
    assert_eq!(
      make_parsed_data(
        Some("628-63-7"),
        Some("C7H14O2"),
        Some("130,19 g/mol"),
        Some("-71 °C"),
        Some("149 °C"),
        Some("WGK 1"),
        Some(&[("H226", "Flüssigkeit und Dampf entzündbar."), ("H412", "Schädlich für Wasserorganismen, mit langfristiger Wirkung.")]),
        Some(&[("P210", "Von Hitze, heißen Oberflächen, Funken, offenen Flammen sowie anderen Zündquellen fernhalten. Nicht rauchen."), ("P370+P378", "Bei Brand: Löschpulver oder Trockensand zum Löschen verwenden.")]),
        Some("Achtung"),
        Some(&["ghs02"]),
        Some(">  1600 mg/kg"),
        None
      ),
      parse_response(&load_substance_json("tests/assets/bananenöl.json")).unwrap()
    )
  }

  #[test]
  fn test_parsing_wasser() {
    assert_eq!(
      make_parsed_data(
        Some("7732-18-5"),
        Some("H2O"),
        Some("18,02 g/mol"),
        Some("0,0 °C"),
        Some("100 °C"),
        None,
        None,
        None,
        None,
        None,
        Some(">  89800 mg/kg"),
        None
      ),
      parse_response(&load_substance_json("tests/assets/wasser.json")).unwrap()
    )
  }
}
