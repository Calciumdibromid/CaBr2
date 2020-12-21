use serde::Deserialize;

use handler::{SearchArguments, SearchType};

use super::handler;

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
  Article {
    zvg_number: String,
    callback: String,
    error: String,
  },
}
