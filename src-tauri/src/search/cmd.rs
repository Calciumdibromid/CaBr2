use serde::Deserialize;

use handler::SearchType;

use super::handler;

#[derive(Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
  // TODO delete
  #[serde(rename_all = "camelCase")]
  QuickSearchSuggestions {
    pattern: String,
    search_type: SearchType,
    callback: String,
    error: String,
  },
  #[serde(rename_all = "camelCase")]
  Search {
    pattern: String,
    search_type: SearchType,
    callback: String,
    error: String,
  },
}
