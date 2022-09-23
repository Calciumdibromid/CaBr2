use std::collections::HashMap;

use lazy_static::lazy_static;

use types::{lock::RwLockWrapper, ProviderMapping};

use crate::{
  error::{LoadSaveError, Result},
  types::{CaBr2Document, DialogFilter, DocumentTypes, Loader, Saver},
};

type LoadersMap = RwLockWrapper<HashMap<&'static str, (&'static str, Box<dyn Loader + Send + Sync>)>>;
type SaversMap = RwLockWrapper<HashMap<&'static str, (&'static str, Box<dyn Saver + Send + Sync>)>>;

lazy_static! {
  pub static ref REGISTERED_LOADERS: LoadersMap = RwLockWrapper::new(HashMap::new());
  pub static ref REGISTERED_SAVERS: SaversMap = RwLockWrapper::new(HashMap::new());
}

pub async fn init_handlers(_provider_mapping: ProviderMapping) {
  let mut _loaders = REGISTERED_LOADERS.write().await;

  #[cfg(feature = "cabr2")]
  _loaders.insert("cb2", ("CaBr2", Box::new(crate::cabr2::CaBr2)));
  #[cfg(feature = "beryllium")]
  _loaders.insert("be", ("Beryllium", Box::new(crate::beryllium::Beryllium)));

  let mut _savers = REGISTERED_SAVERS.write().await;

  #[cfg(feature = "cabr2")]
  _savers.insert("cb2", ("CaBr2", Box::new(crate::cabr2::CaBr2)));
  #[cfg(feature = "pdf")]
  _savers.insert("pdf", ("PDF", Box::new(crate::pdf::PDF::new(_provider_mapping))));
}

pub async fn save_document(file_type: &str, document: CaBr2Document) -> Result<Vec<u8>> {
  let savers = REGISTERED_SAVERS.read().await;

  if let Some((_, saver)) = savers.get(file_type) {
    return saver.save_document(document).await;
  }

  Err(LoadSaveError::UnknownFileType(file_type.to_string()))
}

pub async fn load_document(file_type: &str, contents: Vec<u8>) -> Result<CaBr2Document> {
  let loaders = REGISTERED_LOADERS.read().await;

  if let Some((_, loader)) = loaders.get(file_type) {
    return loader.load_document(contents).await;
  }

  Err(LoadSaveError::UnknownFileType(file_type.to_string()))
}

pub async fn get_available_document_types() -> DocumentTypes {
  let loaders = REGISTERED_LOADERS.read().await;

  let mut load: Vec<DialogFilter> = loaders
    .iter()
    .map(|(ext, (name, _))| DialogFilter {
      name: name.to_string(),
      extensions: vec![ext.to_string()],
    })
    .collect();

  // set cb2 as first element
  if let Some((i, _)) = load.iter().enumerate().find(|(_, f)| f.extensions[0] == "cb2") {
    if i != 0 {
      log::debug!("setting cb2 as first file type from: {}", i);
      load.swap(i, 0);
    }
  }

  let savers = REGISTERED_SAVERS.read().await;

  let save = savers
    .iter()
    .map(|(ext, (name, _))| DialogFilter {
      name: name.to_string(),
      extensions: vec![ext.to_string()],
    })
    .collect();

  DocumentTypes { load, save }
}
