mod types;

use std::{fs::File, io::BufReader, path::PathBuf};

use quick_xml::de::from_reader;

use crate::types::{Data, SubstanceData};

use super::{
  error::{LoadSaveError, Result},
  types::{CaBr2Document, Header, Loader},
};
use types::BerylliumDocument;

pub struct Beryllium;

impl Loader for Beryllium {
  fn load_document(&self, filename: PathBuf) -> Result<CaBr2Document> {
    let file = File::open(filename)?;
    let reader = BufReader::new(file);

    let beryllium_doc = from_reader(reader);

    if beryllium_doc.is_err() {
      return Err(LoadSaveError::DeserializeError(
        beryllium_doc.unwrap_err().to_string(),
      ));
    }

    let beryllium_doc: BerylliumDocument = beryllium_doc.unwrap();

    Ok(CaBr2Document {
      header: Header {
        assistant: beryllium_doc.personal.assistant,
        document_title: beryllium_doc.general.title,
        lab_course: beryllium_doc.general.location,
        name: beryllium_doc.personal.name,
        organisation: beryllium_doc.general.institute,
        place: beryllium_doc.personal.spot,
        preparation: beryllium_doc.product.name,
      },
      disposal: Vec::new(),
      human_and_environment_danger: Vec::new(),
      in_case_of_danger: Vec::new(),
      rules_of_conduct: Vec::new(),
      substance_data: beryllium_doc
        .substances
        .into_iter()
        .map(|substance| SubstanceData {
          boiling_point: Data::new(substance.boiling_point),
          melting_point: Data::new(match substance.melting_point {
            Some(mp) => Some(mp.value),
            None => None,
          }),
          h_phrases: Data::new(match substance.harzard_statements {
            Some(phrases) => phrases
              .split('-')
              .map(|p| (format!("H{}", p), "".into())) // TODO fill statements
              .collect(),
            None => Vec::new(),
          }),
          p_phrases: Data::new(match substance.precautionary_statements {
            Some(phrases) => phrases
              .split('-')
              .map(|p| (format!("P{}", p), "".into())) // TODO fill statements
              .collect(),
            None => Vec::new(),
          }),
          lethal_dose: Data::new(match substance.lethaldose50 {
            Some(ld50) => Some(ld50.value),
            None => None,
          }),
          molecular_formula: Data::new(substance.chemical_formula),
          signal_word: Data::new(substance.signal_word),
          symbols: Data::new(Vec::new()), // TODO convert symbols
          water_hazard_class: Data::new(substance.wgk),
        })
        .collect(),
    })
  }
}
