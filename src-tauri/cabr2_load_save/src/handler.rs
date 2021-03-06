use std::{
  collections::HashMap,
  sync::{Arc, Mutex},
};

use lazy_static::lazy_static;

use cabr2_types::ProviderMapping;

use crate::{
  error::{LoadSaveError, Result},
  types::{CaBr2Document, DialogFilter, DocumentTypes, Loader, Saver},
};

type LoadersMap = Arc<Mutex<HashMap<&'static str, (&'static str, Box<dyn Loader + Send + Sync>)>>>;
type SaversMap = Arc<Mutex<HashMap<&'static str, (&'static str, Box<dyn Saver + Send + Sync>)>>>;

lazy_static! {
  pub static ref REGISTERED_LOADERS: LoadersMap = Arc::new(Mutex::new(HashMap::new()));
  pub static ref REGISTERED_SAVERS: SaversMap = Arc::new(Mutex::new(HashMap::new()));
}

pub fn init_handlers(_provider_mapping: ProviderMapping) {
  let mut _loaders = REGISTERED_LOADERS.lock().unwrap();
  #[cfg(feature = "cabr2")]
  _loaders.insert("cb2", ("CaBr2", Box::new(crate::cabr2::CaBr2)));
  #[cfg(feature = "beryllium")]
  _loaders.insert("be", ("Beryllium", Box::new(crate::beryllium::Beryllium)));

  let mut _savers = REGISTERED_SAVERS.lock().unwrap();
  #[cfg(feature = "cabr2")]
  _savers.insert("cb2", ("CaBr2", Box::new(crate::cabr2::CaBr2)));
  #[cfg(feature = "pdf")]
  _savers.insert("pdf", ("PDF", Box::new(crate::pdf::PDF::new(_provider_mapping))));
}

pub fn save_document(file_type: &str, document: CaBr2Document) -> Result<Vec<u8>> {
  if let Some((_, saver)) = REGISTERED_SAVERS.lock().unwrap().get(file_type) {
    return saver.save_document(document);
  }

  Err(LoadSaveError::UnknownFileType)
}

pub fn load_document(file_type: &str, contents: Vec<u8>) -> Result<CaBr2Document> {
  if let Some((_, loader)) = REGISTERED_LOADERS.lock().unwrap().get(file_type) {
    return loader.load_document(contents);
  }

  Err(LoadSaveError::UnknownFileType)
}

pub fn get_available_document_types() -> Result<DocumentTypes> {
  let mut load: Vec<DialogFilter> = REGISTERED_LOADERS
    .lock()
    .expect("couldn't get lock for REGISTERED_LOADERS")
    .iter()
    .map(|(ext, (name, _))| DialogFilter {
      name: name.to_string(),
      extensions: vec![ext.to_string()],
    })
    .collect();

  // set cb2 as first element
  if let Some((i, _)) = (&load).iter().enumerate().find(|(_, f)| f.extensions[0] == "cb2") {
    if i != 0 {
      log::debug!("setting cb2 as first file type from: {}", i);
      load.swap(i, 0);
    }
  }

  let save = REGISTERED_SAVERS
    .lock()
    .expect("couldn't get lock for REGISTERED_SAVERS")
    .iter()
    .map(|(ext, (name, _))| DialogFilter {
      name: name.to_string(),
      extensions: vec![ext.to_string()],
    })
    .collect();

  Ok(DocumentTypes { load, save })
}
