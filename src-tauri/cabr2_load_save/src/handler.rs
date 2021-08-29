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

pub async fn init_handlers(_provider_mapping: ProviderMapping) {
  let mut _loaders = REGISTERED_LOADERS.lock().expect("failed to lock loaders");
  #[cfg(feature = "cabr2")]
  _loaders.insert("cb2", ("CaBr2", Box::new(crate::cabr2::CaBr2)));
  #[cfg(feature = "beryllium")]
  _loaders.insert("be", ("Beryllium", Box::new(crate::beryllium::Beryllium)));

  let mut _savers = REGISTERED_SAVERS.lock().expect("failed to lock savers");
  #[cfg(feature = "cabr2")]
  _savers.insert("cb2", ("CaBr2", Box::new(crate::cabr2::CaBr2)));
  #[cfg(feature = "pdf")]
  _savers.insert("pdf", ("PDF", Box::new(crate::pdf::PDF::new(_provider_mapping))));
}

pub async fn save_document(file_type: &str, document: CaBr2Document) -> Result<Vec<u8>> {
  if let Some((_, saver)) = REGISTERED_SAVERS.lock().expect("failed to lock savers").get(file_type) {
    // This may be a long running, cpu intensive task (e.g. PDF). This informs the runtime to move other waiting tasks
    // to different threads.
    #[cfg(not(feature = "wasm"))]
    return tokio::task::block_in_place(|| saver.save_document(document));
    #[cfg(feature = "wasm")]
    return saver.save_document(document);
  }

  Err(LoadSaveError::UnknownFileType)
}

pub async fn load_document(file_type: &str, contents: Vec<u8>) -> Result<CaBr2Document> {
  if let Some((_, loader)) = REGISTERED_LOADERS
    .lock()
    .expect("failed to lock loaders")
    .get(file_type)
  {
    // This may be a long running, cpu intensive task (e.g. PDF). This informs the runtime to move other waiting tasks
    // to different threads.
    #[cfg(not(feature = "wasm"))]
    return tokio::task::block_in_place(|| loader.load_document(contents));
    #[cfg(feature = "wasm")]
    return loader.load_document(contents);
  }

  Err(LoadSaveError::UnknownFileType)
}

pub async fn get_available_document_types() -> Result<DocumentTypes> {
  let mut load: Vec<DialogFilter> = REGISTERED_LOADERS
    .lock()
    .expect("failed to lock loaders")
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
    .expect("failed to lock savers")
    .iter()
    .map(|(ext, (name, _))| DialogFilter {
      name: name.to_string(),
      extensions: vec![ext.to_string()],
    })
    .collect();

  Ok(DocumentTypes { load, save })
}
