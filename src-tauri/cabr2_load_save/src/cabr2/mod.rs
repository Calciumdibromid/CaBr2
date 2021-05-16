use super::{
  error::Result,
  types::{CaBr2Document, Loader, Saver},
};

pub struct CaBr2;

impl Loader for CaBr2 {
  fn load_document(&self, contents: Vec<u8>) -> Result<CaBr2Document> {
    Ok(serde_json::from_slice(&contents)?)
  }
}

impl Saver for CaBr2 {
  fn save_document(&self, document: CaBr2Document) -> Result<Vec<u8>> {
    Ok(serde_json::to_vec(&document)?)
  }
}
