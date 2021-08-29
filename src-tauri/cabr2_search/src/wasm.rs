use std::collections::HashMap;

use cabr2_types::SubstanceData;

use crate::{
  error::Result,
  handler,
  types::{ProviderInfo, SearchArguments, SearchResponse, SearchType},
};

pub async fn init() {
  handler::init_providers().await.expect("failed to initialize providers");
}

pub async fn get_provider_mapping() -> HashMap<String, String> {
  handler::get_provider_mapping().await
}

pub async fn get_available_providers() -> Vec<ProviderInfo> {
  handler::get_available_providers().await
}

pub async fn search_suggestions(provider: String, pattern: String, search_type: SearchType) -> Result<Vec<String>> {
  handler::get_quick_search_suggestions(provider, search_type, pattern).await
}

pub async fn search_results(provider: String, arguments: SearchArguments) -> Result<Vec<SearchResponse>> {
  handler::get_search_results(provider, arguments).await
}

pub async fn get_substance_data(provider: String, identifier: String) -> Result<SubstanceData> {
  handler::get_substance_data(provider, identifier).await
}
