use async_trait::async_trait;

use super::{
  error::Result,
  types::{CaBr2Document, Loader, Saver},
};

pub struct CaBr2;

#[cfg_attr(not(feature = "wasm"), async_trait)]
#[cfg_attr(feature = "wasm", async_trait(?Send))]
impl Loader for CaBr2 {
  async fn load_document(&self, contents: Vec<u8>) -> Result<CaBr2Document> {
    Ok(serde_json::from_slice(&contents)?)
  }
}

#[cfg_attr(not(feature = "wasm"), async_trait)]
#[cfg_attr(feature = "wasm", async_trait(?Send))]
impl Saver for CaBr2 {
  async fn save_document(&self, document: CaBr2Document) -> Result<Vec<u8>> {
    Ok(serde_json::to_vec(&document)?)
  }
}
