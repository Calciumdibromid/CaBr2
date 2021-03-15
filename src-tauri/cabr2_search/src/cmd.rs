use serde::Deserialize;

use crate::types::{SearchArguments, SearchType};

#[derive(Debug, Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
  GetAvailableProviders {
    callback: String,
    error: String,
  },
  #[serde(rename_all = "camelCase")]
  SearchSuggestions {
    provider: String,
    pattern: String,
    search_type: SearchType,
    callback: String,
    error: String,
  },
  Search {
    provider: String,
    arguments: SearchArguments,
    callback: String,
    error: String,
  },
  GetSubstanceData {
    provider: String,
    identifier: String,
    callback: String,
    error: String,
  },
}
