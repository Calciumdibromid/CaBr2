use std::collections::BTreeMap;

use lazy_static::lazy_static;
use roxmltree::{Document, Node, NodeId};

use super::{
  error::{GestisError, Result},
  types::{GestisResponse, ParsedData},
};

lazy_static! {
  pub static ref CHAPTER_MAPPING: BTreeMap<&'static str, (&'static str, &'static str)> = [
    ("boiling_point", ("0600", "0603")),
    ("cas_number", ("0100", "0100")),
    ("h_p_signal_symbols", ("1100", "1303")),
    ("lethal_dose", ("0500", "0501")),
    ("mak1", ("1100", "1201")),
    ("mak2", ("1100", "1203")),
    ("melting_point", ("0600", "0602")),
    ("molecular_formula", ("0400", "0400")),
    ("water_hazard_class", ("1100", "1106")),
  ]
  .iter()
  .cloned()
  .collect();
}

pub fn parse_response(json: &GestisResponse) -> Result<ParsedData> {
  log::info!("extracting data for: {} [{}] ...", json.name, json.zvg_number);

  let h_p_signal_symbols_error;
  let (h_phrases, p_phrases, signal_word, symbols) = match get_h_p_signal_symbols(json) {
    Ok(inner) => {
      h_p_signal_symbols_error = None;
      inner
    }
    Err(e) => {
      h_p_signal_symbols_error = Some(e);
      (
        // this error type should not be used like this but here it is
        // only a sentinel value that is ignored further down anyways
        Err(GestisError::Empty),
        Err(GestisError::Empty),
        Err(GestisError::Empty),
        Err(GestisError::Empty),
      )
    }
  };

  let molecular_formula_molar_mass_error;
  let (molecular_formula, molar_mass) = match get_molecular_formula_molar_mass(json) {
    Ok(inner) => {
      molecular_formula_molar_mass_error = None;
      inner
    }
    Err(e) => {
      molecular_formula_molar_mass_error = Some(e);
      (
        // this error type should not be used like this but here it is
        // only a sentinel value that is ignored further down anyways
        Err(GestisError::Empty),
        Err(GestisError::Empty),
      )
    }
  };

  Ok(ParsedData {
    cas: match get_cas(json) {
      Ok(inner) => Some(inner),
      Err(e) => {
        let e = match &molecular_formula_molar_mass_error {
          Some(e_new) => e_new,
          None => &e,
        };
        log::debug!("[cas_number] error: {:#?}", e);
        None
      }
    },
    molecular_formula: match molecular_formula {
      Ok(inner) => Some(inner),
      Err(e) => {
        let e = match &molecular_formula_molar_mass_error {
          Some(e_new) => e_new,
          None => &e,
        };
        log::debug!("[molecular_formula] error: {:#?}", e);
        None
      }
    },
    molar_mass: match molar_mass {
      Ok(inner) => Some(inner),
      Err(e) => {
        let e = match &molecular_formula_molar_mass_error {
          Some(e_new) => e_new,
          None => &e,
        };
        log::debug!("[molar_mass] error: {:#?}", e);
        None
      }
    },
    melting_point: match get_melting_point(json) {
      Ok(inner) => Some(inner),
      Err(e) => {
        log::debug!("[melting_point] error: {:#?}", e);
        None
      }
    },
    boiling_point: match get_boiling_point(json) {
      Ok(inner) => Some(inner),
      Err(e) => {
        log::debug!("[boiling_point] error: {:#?}", e);
        None
      }
    },
    water_hazard_class: match get_whc(json) {
      Ok(inner) => Some(inner),
      Err(e) => {
        log::debug!("[water_hazard_class] error: {:#?}", e);
        None
      }
    },
    h_phrases: match h_phrases {
      Ok(inner) => Some(inner),
      Err(e) => {
        let e = match &h_p_signal_symbols_error {
          Some(e_new) => e_new,
          None => &e,
        };
        log::debug!("[h_phrases] error: {:#?}", e);
        None
      }
    },
    p_phrases: match p_phrases {
      Ok(inner) => Some(inner),
      Err(e) => {
        let e = match &h_p_signal_symbols_error {
          Some(e_new) => e_new,
          None => &e,
        };
        log::debug!("[p_phrases] error: {:#?}", e);
        None
      }
    },
    signal_word: match signal_word {
      Ok(inner) => Some(inner),
      Err(e) => {
        let e = match &h_p_signal_symbols_error {
          Some(e_new) => e_new,
          None => &e,
        };
        log::debug!("[signal_word] error: {:#?}", e);
        None
      }
    },
    symbols: match symbols {
      Ok(inner) => Some(inner),
      Err(e) => {
        let e = match &h_p_signal_symbols_error {
          Some(e_new) => e_new,
          None => &e,
        };
        log::debug!("[symbols] error: {:#?}", e);
        None
      }
    },
    lethal_dose: match get_lethal_dose(json) {
      Ok(inner) => inner,
      Err(e) => {
        log::debug!("[lethal_dose] error: {:#?}", e);
        match e {
          GestisError::Multiple(inner) => Some(inner),
          _ => None,
        }
      }
    },
    mak: match get_mak(json) {
      Ok(inner) => Some(inner),
      Err(e) => {
        log::debug!("[mak] error: {:#?}", e);
        None
      }
    },
  })
}

/* #region  helpers */

pub fn get_xml(json: &GestisResponse, chapter: &str, subchapter: &str) -> Result<String> {
  if let Some(subchapters) = json.chapters.iter().find(|c| c.number == chapter) {
    if let Some(sub) = subchapters.subchapters.iter().find(|s| s.number == subchapter) {
      return Ok(format!("<div>\n{}</div>\n", sub.text.as_ref().unwrap()));
    }
  }
  Err(GestisError::NoXML)
}

#[inline]
fn tables(node: &Node, class: &str) -> Vec<Vec<Vec<NodeId>>> {
  node
    .children()
    .filter(|n| {
      n.has_tag_name("table")
                // && n.has_attribute("class")
                && n.attribute_node("class").unwrap().value() == class
    })
    .map(|n| {
      n.children()
        .filter(|c| c.has_tag_name("tr"))
        .map(|n| n.children().filter(|n| n.has_tag_name("td")).map(|n| n.id()).collect())
        .collect()
    })
    .collect()
}

/* #endregion */

/* #region  extractors */

fn get_cas(json: &GestisResponse) -> Result<String> {
  let (chapter, subchapter) = CHAPTER_MAPPING.get("cas_number").unwrap();
  let xml = get_xml(json, chapter, subchapter)?;
  let doc = Document::parse(&xml)?;

  for table in tables(&doc.root().first_child().unwrap(), "block")
    .into_iter()
    // each table has only one row ¯\_(ツ)_/¯
    .flatten()
  {
    if table.len() < 2 {
      continue;
    }
    let data = doc.get_node(table[1]).unwrap();
    if let Some(cas) = data.first_element_child() {
      if cas.has_tag_name("casnr") {
        return Ok(cas.text().unwrap().into());
      }
    }
  }

  Err(GestisError::MissingInfo("cas number".into()))
}

fn get_molecular_formula_molar_mass(json: &GestisResponse) -> Result<(Result<String>, Result<String>)> {
  let (chapter, subchapter) = CHAPTER_MAPPING.get("molecular_formula").unwrap();
  let xml = get_xml(json, chapter, subchapter)?;
  let doc = Document::parse(&xml)?;

  let mut id_tables = tables(&doc.root().first_child().unwrap(), "block")
    // tables
    .into_iter()
    // rows
    .flatten()
    // ids
    .flatten();

  let mut data;

  // kill empty tables at beginning
  loop {
    let data_id = id_tables.next().unwrap();
    data = doc.get_node(data_id).unwrap();
    if data.children().count() > 0 {
      break;
    }
  }

  let mut molecular_formula = Err(GestisError::MissingInfo("molecular formula".into()));
  if let Some(mf) = data.children().find(|c| c.has_tag_name("summenformel")) {
    molecular_formula = Ok(mf.first_child().unwrap().text().unwrap().into());
  }

  let mut molar_mass = Err(GestisError::MissingInfo("molar mass".into()));
  if let Some(new_table_id) = id_tables.nth(2) {
    let mut new_table = tables(&doc.get_node(new_table_id).unwrap(), "feldmitlabel")
      .into_iter()
      .flatten()
      .flatten();
    if let Some(text) = doc.get_node(new_table.nth(1).unwrap()).unwrap().text() {
      molar_mass = Ok(text.trim().into())
    }
  }

  Ok((molecular_formula, molar_mass))
}

fn get_melting_point(json: &GestisResponse) -> Result<String> {
  get_mp_bp(json, "melting_point", "Schmelzpunkt:")
}

fn get_boiling_point(json: &GestisResponse) -> Result<String> {
  get_mp_bp(json, "boiling_point", "Siedepunkt:")
}

/// returns melting point or boiling point
fn get_mp_bp(json: &GestisResponse, name: &str, xml_check: &str) -> Result<String> {
  let (chapter, subchapter) = CHAPTER_MAPPING.get(name).unwrap();
  let xml = get_xml(json, chapter, subchapter)?;
  let doc = Document::parse(&xml)?;

  let mut mp_bp_point = None;

  for data_id in tables(&doc.root().first_child().unwrap(), "block")
    // tables
    .into_iter()
    // rows
    .flatten()
    // ids
    .flatten()
  {
    let data = doc.get_node(data_id).unwrap();
    let tables = tables(&data, "feldmitlabel");
    if tables.is_empty() {
      continue;
    }
    let mut inner_data_ids = tables
      // tables
      .into_iter()
      // rows
      .flatten()
      // ids
      .flatten();

    let mp_bp_text_node = doc.get_node(inner_data_ids.next().unwrap()).unwrap();
    if let Some(mp_bp_text) = mp_bp_text_node.text() {
      if mp_bp_text == xml_check {
        let mp_bp_node = doc.get_node(inner_data_ids.next().unwrap()).unwrap();
        mp_bp_point = mp_bp_node.text();
      }
    }
  }

  match mp_bp_point {
    Some(mp) => Ok(mp.trim().into()),
    None => Err(GestisError::MissingInfo(name.into())),
  }
}

fn get_whc(json: &GestisResponse) -> Result<String> {
  static KEYWORD: &str = "Nicht wassergefährdender Stoff";

  let (chapter, subchapter) = CHAPTER_MAPPING.get("water_hazard_class").unwrap();
  let xml = get_xml(json, chapter, subchapter)?;
  let doc = Document::parse(&xml)?;

  let mut tables = tables(&doc.root().first_child().unwrap(), "block")
    // tables
    .into_iter()
    // rows
    .flatten()
    // ids
    .flatten();

  let mut data;

  // kill empty tables at beginning
  loop {
    let data_id = tables.next().unwrap();
    data = doc.get_node(data_id).unwrap();
    if data.children().count() > 0 {
      break;
    }
  }

  if let Some(node_id) = tables.next() {
    data = doc.get_node(node_id).unwrap();
    let text = data.text().unwrap();
    if text == KEYWORD {
      return Err(GestisError::Empty);
    } else {
      return Ok(text.split('-').next().unwrap().trim().into());
    }
  }

  Err(GestisError::MissingInfo("water hazard class".into()))
}

type HPSignalSymbolsResult = Result<(
  Result<Vec<(std::string::String, std::string::String)>>,
  Result<Vec<(std::string::String, std::string::String)>>,
  Result<std::string::String>,
  Result<Vec<String>>,
)>;

fn get_h_p_signal_symbols(json: &GestisResponse) -> HPSignalSymbolsResult {
  #[inline]
  fn extract_h_p(id: NodeId, doc: &Document) -> Vec<(String, String)> {
    let data = doc.get_node(id).unwrap();
    data
      .children()
      .filter(|n| n.is_text())
      .map(|n| n.text().unwrap())
      .map(|s| s.splitn(2, ':').map(|s| s.trim()).collect::<Vec<&str>>())
      // TODO remove lines that are no h/p-phrases
      .filter(|v| v.len() > 1) // TODO quickfix, remove
      .map(|v| (v[0].into(), v[1].into()))
      .collect()
  }

  let (chapter, subchapter) = CHAPTER_MAPPING.get("h_p_signal_symbols").unwrap();
  let xml = get_xml(json, chapter, subchapter)?;
  let doc = Document::parse(&xml)?;

  let mut h_phrases = Err(GestisError::MissingInfo("h phrases".into()));
  let mut p_phrases = Err(GestisError::MissingInfo("p phrases".into()));
  let mut signal_word = Err(GestisError::MissingInfo("signal word".into()));
  let mut symbols = Err(GestisError::MissingInfo("symbols".into()));

  for table in tables(&doc.root().first_child().unwrap(), "block").into_iter() {
    let mut row_iter = table.into_iter();

    if let Some(row) = row_iter.next() {
      let mut data_iter = row.into_iter().map(|id| doc.get_node(id).unwrap()).peekable();

      if let Some(data) = data_iter.peek() {
        if let Some(inner) = data.first_element_child() {
          if inner.has_tag_name("b") {
            if inner.text() == Some("Gefahrenhinweise - H-Sätze:") {
              if let Some(row) = row_iter.next() {
                h_phrases = Ok(extract_h_p(row[0], &doc));
              }
            } else if inner.text() == Some("Sicherheitshinweise - P-Sätze:") {
              if let Some(row) = row_iter.next() {
                p_phrases = Ok(extract_h_p(row[0], &doc));
              }
            }
          } else if inner.has_tag_name("img") {
            symbols = Ok(
              data_iter
                .map(|n| n.first_element_child())
                .filter(|n| n.is_some())
                .map(|n| {
                  let data = n.unwrap();
                  // only alt text is needed as identifier
                  data.attribute("alt").unwrap().trim_end_matches("-neu").into()
                })
                .collect::<Vec<String>>(),
            );
          } else if inner.has_tag_name("table") {
            let mut table_iter = tables(data, "feldmitlabel")
              .into_iter()
              .flatten()
              .flatten()
              .map(|id| doc.get_node(id).unwrap());
            if let Some(data) = table_iter.next() {
              if let Some(inner) = data.first_element_child() {
                if inner.has_tag_name("b") && inner.text() == Some("Signalwort:") {
                  signal_word = Ok(table_iter.next().unwrap().text().unwrap().trim_matches('"').to_string());
                }
              }
            }
          }
        }
      }
    }
  }

  Ok((h_phrases, p_phrases, signal_word, symbols))
}

fn get_lethal_dose(json: &GestisResponse) -> Result<Option<String>> {
  let (chapter, subchapter) = CHAPTER_MAPPING.get("lethal_dose").unwrap();
  let xml = get_xml(json, chapter, subchapter)?;
  let doc = Document::parse(&xml)?;

  let mut ld50: Option<&str> = None;

  let mut table_iter = tables(&doc.root().first_child().unwrap(), "block").into_iter();

  while let Some(table) = table_iter.next() {
    let mut row_iter = table.into_iter();

    if let Some(row) = row_iter.next() {
      let mut data_iter = row.into_iter().map(|id| doc.get_node(id).unwrap()).peekable();

      if let Some(data) = data_iter.peek() {
        if let Some(inner) = data.first_element_child() {
          if inner.has_tag_name("b") && inner.text() == Some("LD50 oral Ratte") {
            if let Some(inner) = ld50 {
              return Err(GestisError::Multiple(inner.into()));
            } else if let Some(table) = table_iter.next() {
              let mut row_iter = table.into_iter();

              if let Some(row) = row_iter.next() {
                let mut data_iter = row.into_iter().map(|id| doc.get_node(id).unwrap());

                if let Some(data) = data_iter.next() {
                  if let Some(text) = data.first_child() {
                    if text.text() == Some("Wert:") {
                      if let Some(value) = data_iter.next() {
                        ld50 = value.text();
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  match ld50 {
    Some(inner) => Ok(Some(inner.into())),
    None => Err(GestisError::MissingInfo("lethal dose".into())),
  }
}

fn get_mak(_json: &GestisResponse) -> Result<String> {
  // TODO implement function
  log::error!("not implemented: 'get_mak()'");
  Err(GestisError::MissingInfo("mak".into()))
}

/* #endregion */

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
      symbols: symbols.map(|v| v.into_iter().map(|s| s.to_string()).collect()),
      lethal_dose: lethal_dose.map(String::from),
      mak: mak.map(String::from),
    }
  }

  fn map_phrases(phrases: &[(&str, &str)]) -> Vec<(String, String)> {
    phrases
      .into_iter()
      .map(|(n, p)| (n.to_string(), p.to_string()))
      .collect()
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

// ` [abcdefghijklmnopqrstuvwxyz_]+: `
