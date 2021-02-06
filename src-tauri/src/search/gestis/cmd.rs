use serde::Deserialize;

use super::types::{SearchArguments, SearchType};

#[derive(Debug, Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
  #[serde(rename_all = "camelCase")]
  SearchSuggestions {
    pattern: String,
    search_type: SearchType,
    callback: String,
    error: String,
  },
  #[serde(rename_all = "camelCase")]
  Search {
    arguments: SearchArguments,
    callback: String,
    error: String,
  },
  #[serde(rename_all = "camelCase")]
  GetSubstanceData {
    zvg_number: String,
    callback: String,
    error: String,
  },
}
