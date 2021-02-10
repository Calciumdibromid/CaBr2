mod types;

use std::{fs::File, io::BufReader, path::PathBuf};

use quick_xml::de::from_reader;

use self::types::BerylliumDocument;

use super::{
  error::{LoadSaveError, Result},
  types::{CaBr2Document, Header, Loader},
};

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
      substance_data: Vec::new(),
    })
  }
}
