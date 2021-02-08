use std::{
  collections::HashMap,
  path::PathBuf,
  sync::{Arc, Mutex},
};

use lazy_static::lazy_static;

use super::{
  error::{LoadSaveError, Result},
  types::{CaBr2Document, Loader, Saver},
};

lazy_static! {
  pub static ref REGISTERED_LOADERS: Arc<Mutex<HashMap<&'static str, Box<dyn Loader + Send + Sync>>>> =
    Arc::new(Mutex::new(HashMap::new()));
  pub static ref REGISTERED_SAVERS: Arc<Mutex<HashMap<&'static str, Box<dyn Saver + Send + Sync>>>> =
    Arc::new(Mutex::new(HashMap::new()));
}

pub fn save_document(file_type: String, filename: PathBuf, document: CaBr2Document) -> Result<()> {
  log::debug!("type: {}", file_type);
  log::debug!("filename: {:?}", filename);
  log::debug!("doc: {:#?}", document);

  let mut filename = filename;
  filename.set_extension(&file_type);

  if let Some(saver) = REGISTERED_SAVERS.lock().unwrap().get(file_type.as_str()) {
    return saver.save_document(filename, document);
  }

  Err(LoadSaveError::UnknownFileType)
}

pub fn load_document(filename: PathBuf) -> Result<CaBr2Document> {
  log::debug!("filename: {:?}", filename);

  if let Some(extension) = filename.extension() {
    let extension = extension.to_str().unwrap();
    if let Some(loader) = REGISTERED_LOADERS.lock().unwrap().get(extension) {
      return loader.load_document(filename);
    }
  }

  Err(LoadSaveError::UnknownFileType)
}
