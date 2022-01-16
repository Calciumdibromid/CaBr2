use std::collections::HashMap;

use cfg_if::cfg_if;
use lazy_static::lazy_static;

use ::types::ProviderMapping;

use crate::{
  error::{LoadSaveError, Result},
  types::{CaBr2Document, DialogFilter, DocumentTypes, Loader, Saver},
};

// because tokio doesn't fully support wasm we have to use two different implementations for these locks
cfg_if! {
  if #[cfg(feature = "__tokio")] {
    use tokio::sync::RwLock;
  } else {
    use std::sync::RwLock;
  }
}

type LoadersMap = RwLock<HashMap<&'static str, (&'static str, Box<dyn Loader + Send + Sync>)>>;
type SaversMap = RwLock<HashMap<&'static str, (&'static str, Box<dyn Saver + Send + Sync>)>>;

lazy_static! {
  pub static ref REGISTERED_LOADERS: LoadersMap = RwLock::new(HashMap::new());
  pub static ref REGISTERED_SAVERS: SaversMap = RwLock::new(HashMap::new());
}

pub async fn init_handlers(_provider_mapping: ProviderMapping) {
  cfg_if! {
    if #[cfg(feature = "__tokio")] {
      let mut _loaders = REGISTERED_LOADERS.write().await;
    } else {
      let mut _loaders = REGISTERED_LOADERS.write().expect("failed to get write lock of loaders");
    }
  }

  #[cfg(feature = "cabr2")]
  _loaders.insert("cb2", ("CaBr2", Box::new(crate::cabr2::CaBr2)));
  #[cfg(feature = "beryllium")]
  _loaders.insert("be", ("Beryllium", Box::new(crate::beryllium::Beryllium)));

  cfg_if! {
    if #[cfg(feature = "__tokio")] {
      let mut _savers = REGISTERED_SAVERS.write().await;
    } else {
      let mut _savers = REGISTERED_SAVERS.write().expect("failed to get write lock of savers");
    }
  }

  #[cfg(feature = "cabr2")]
  _savers.insert("cb2", ("CaBr2", Box::new(crate::cabr2::CaBr2)));
  #[cfg(feature = "pdf")]
  _savers.insert("pdf", ("PDF", Box::new(crate::pdf::PDF::new(_provider_mapping))));
}

pub async fn save_document(file_type: &str, document: CaBr2Document) -> Result<Vec<u8>> {
  cfg_if! {
    if #[cfg(feature = "__tokio")] {
      let savers = REGISTERED_SAVERS.read().await;
    } else {
      let savers = REGISTERED_SAVERS.read().expect("failed to get read lock of savers");
    }
  }

  if let Some((_, saver)) = savers.get(file_type) {
    return saver.save_document(document).await;
  }

  Err(LoadSaveError::UnknownFileType(file_type.to_string()))
}

pub async fn load_document(file_type: &str, contents: Vec<u8>) -> Result<CaBr2Document> {
  cfg_if! {
    if #[cfg(feature = "__tokio")] {
      let loaders = REGISTERED_LOADERS.read().await;
    } else {
      let loaders = REGISTERED_LOADERS.read().expect("failed to get read lock of loaders");
    }
  }

  if let Some((_, loader)) = loaders.get(file_type) {
    return loader.load_document(contents).await;
  }

  Err(LoadSaveError::UnknownFileType(file_type.to_string()))
}

pub async fn get_available_document_types() -> DocumentTypes {
  cfg_if! {
    if #[cfg(feature = "__tokio")] {
      let loaders = REGISTERED_LOADERS.read().await;
    } else {
      let loaders = REGISTERED_LOADERS.read().expect("failed to get read lock of loaders");
    }
  }

  let mut load: Vec<DialogFilter> = loaders
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

  cfg_if! {
    if #[cfg(feature = "__tokio")] {
      let savers = REGISTERED_SAVERS.read().await;
    } else {
      let savers = REGISTERED_SAVERS.read().expect("failed to get read lock of savers");
    }
  }

  let save = savers
    .iter()
    .map(|(ext, (name, _))| DialogFilter {
      name: name.to_string(),
      extensions: vec![ext.to_string()],
    })
    .collect();

  DocumentTypes { load, save }
}
