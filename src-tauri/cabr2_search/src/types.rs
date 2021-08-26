use serde::{Deserialize, Serialize};
use async_trait::async_trait;

use cabr2_types::SubstanceData;

use super::error::Result;

#[async_trait]
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
#[serde(rename_all = "camelCase")]
pub struct SearchResponse {
  #[serde(rename(deserialize = "zvg_nr"))]
  pub zvg_number: String,
  #[serde(rename(deserialize = "cas_nr"))]
  pub cas_number: Option<String>,
  pub name: String,
}
