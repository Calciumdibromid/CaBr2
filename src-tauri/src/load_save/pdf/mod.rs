use std::path::PathBuf;

use super::{
  error::{LoadSaveError, Result},
  types::{CaBr2Document, Saver},
};

pub struct PDF;

impl Saver for PDF {
  fn save_document(&self, _filename: PathBuf, _document: CaBr2Document) -> Result<()> {
    log::error!("not yet implemented");
    Err(LoadSaveError::UnknownFileType)
  }
}
