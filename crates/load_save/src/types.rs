use async_trait::async_trait;
use serde::{Deserialize, Serialize};

use ::types::SubstanceData;

use super::error::Result;

#[cfg_attr(not(target_family = "wasm"), async_trait)]
#[cfg_attr(target_family = "wasm", async_trait(?Send))]
pub trait Loader {
  async fn load_document(&self, contents: Vec<u8>) -> Result<CaBr2Document>;
}

#[cfg_attr(not(target_family = "wasm"), async_trait)]
#[cfg_attr(target_family = "wasm", async_trait(?Send))]
pub trait Saver {
  async fn save_document(&self, document: CaBr2Document) -> Result<Vec<u8>>;
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CaBr2Document {
  pub header: Header,
  pub substance_data: Vec<SubstanceData>,
  pub human_and_environment_danger: Vec<String>,
  pub rules_of_conduct: Vec<String>,
  pub in_case_of_danger: Vec<String>,
  pub disposal: Vec<String>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Header {
  pub document_title: String,
  pub organization: String,
  pub lab_course: String,
  pub name: String,
  pub place: String,
  pub assistant: String,
  pub preparation: String,
}

#[derive(Debug, Serialize)]
pub struct DocumentTypes {
  pub load: Vec<DialogFilter>,
  pub save: Vec<DialogFilter>,
}

#[derive(Debug, Serialize)]
pub struct DialogFilter {
  pub name: String,
  pub extensions: Vec<String>,
}
