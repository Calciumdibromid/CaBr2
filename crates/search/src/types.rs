use async_trait::async_trait;
use serde::{Deserialize, Serialize};

use ::types::SubstanceData;

use super::error::Result;

#[cfg_attr(not(target_family = "wasm"), async_trait)]
#[cfg_attr(target_family = "wasm", async_trait(?Send))]
pub trait Provider {
  fn get_name(&self) -> String;
  async fn get_quick_search_suggestions(&self, search_type: SearchType, pattern: String) -> Result<Vec<String>>;
  async fn get_search_results(&self, arguments: SearchArguments) -> Result<Vec<SearchResponse>>;
  async fn get_substance_data(&self, identifier: String) -> Result<SubstanceData>;
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ProviderInfo {
  pub name: String,
  pub identifier: String,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum SearchType {
  ChemicalName,
  ChemicalFormula,
  Numbers,
  FullText,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchArgument {
  pub search_type: SearchType,
  pub pattern: String,
}

#[derive(Debug, Deserialize)]
pub struct SearchArguments {
  #[serde(default)]
  pub exact: bool,
  pub arguments: Vec<SearchArgument>,
}

#[derive(Serialize, Deserialize)]
pub struct SearchResponse {
  pub identifier: String,
  pub cas_number: Option<String>,
  pub name: String,
}
