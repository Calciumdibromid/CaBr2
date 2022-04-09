mod error;
mod migrations;
mod types;

#[cfg(test)]
mod tests;

use async_trait::async_trait;

use super::{
  error::Result,
  types::{CaBr2Document, Loader, Saver},
};

use self::types::CaBr2DocumentV0;
pub use self::{error::Cabr2Error, types::CaBr2DocumentFormat};

pub struct CaBr2;

#[cfg_attr(not(target_family = "wasm"), async_trait)]
#[cfg_attr(target_family = "wasm", async_trait(?Send))]
impl Loader for CaBr2 {
  async fn load_document(&self, contents: Vec<u8>) -> Result<CaBr2Document> {
    match serde_json::from_slice::<CaBr2DocumentFormat>(&contents) {
      Ok(document) => Ok(match document {
        CaBr2DocumentFormat::V1(doc) => doc,
      }),
      Err(_) => {
        let old_doc: CaBr2DocumentV0 = serde_json::from_slice(&contents).map_err(Cabr2Error::from)?;

        Ok(old_doc.into())
      }
    }
  }
}

#[cfg_attr(not(target_family = "wasm"), async_trait)]
#[cfg_attr(target_family = "wasm", async_trait(?Send))]
impl Saver for CaBr2 {
  async fn save_document(&self, document: CaBr2Document) -> Result<Vec<u8>> {
    let doc = CaBr2DocumentFormat::V1(document);
    Ok(serde_json::to_vec(&doc).map_err(Cabr2Error::from)?)
  }
}
