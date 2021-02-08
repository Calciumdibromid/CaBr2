use std::path::PathBuf;

use super::{
  error::{LoadSaveError, Result},
  types::{CaBr2Document, Loader},
};

pub struct Beryllium;

impl Loader for Beryllium {
  fn load_document(&self, _filename: PathBuf) -> Result<CaBr2Document> {
    log::error!("not yet implemented");
    Err(LoadSaveError::UnknownFileType)
  }
}
