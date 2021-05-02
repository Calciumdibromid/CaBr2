use cabr2_types::SubstanceData;

use crate::{
  error::Result,
  handler,
  types::{ProviderInfo, SearchArguments, SearchResponse, SearchType},
};

#[tauri::command]
pub fn get_available_providers() -> Result<Vec<ProviderInfo>> {
  handler::get_available_providers()
}

#[tauri::command]
pub fn search_suggestions(provider: String, pattern: String, search_type: SearchType) -> Result<Vec<String>> {
  handler::get_quick_search_suggestions(provider, search_type, pattern)
}

#[tauri::command]
pub fn search(provider: String, arguments: SearchArguments) -> Result<Vec<SearchResponse>> {
  handler::get_search_results(provider, arguments)
}

#[tauri::command]
pub fn get_substance_data(provider: String, identifier: String) -> Result<SubstanceData> {
  handler::get_substance_data(provider, identifier)
}
