use std::collections::HashMap;

use tauri::{plugin::Plugin, Invoke, Runtime, Window};

use ::types::SubstanceData;
use search::{
  error::Result,
  handler,
  types::{ProviderInfo, SearchArguments, SearchResponse, SearchType},
};

#[tauri::command]
pub async fn get_available_providers() -> Vec<ProviderInfo> {
  handler::get_available_providers().await
}

#[tauri::command]
pub async fn search_suggestions(provider: String, pattern: String, search_type: SearchType) -> Result<Vec<String>> {
  handler::get_quick_search_suggestions(provider, search_type, pattern).await
}

#[tauri::command]
pub async fn search(provider: String, arguments: SearchArguments) -> Result<Vec<SearchResponse>> {
  handler::get_search_results(provider, arguments).await
}

#[tauri::command]
pub async fn get_substance_data(provider: String, identifier: String) -> Result<SubstanceData> {
  handler::get_substance_data(provider, identifier).await
}

pub struct Search<R: Runtime> {
  invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync>,
}

pub async fn get_provider_mapping() -> HashMap<String, String> {
  handler::get_provider_mapping().await
}

impl<R: Runtime> Search<R> {
  pub async fn new() -> Self {
    // Must be finished when this function exits, because other init functions depend on the result of this.
    handler::init_providers(env!("CARGO_PKG_VERSION"))
      .await
      .expect("failed to initialize providers");
    Search {
      invoke_handler: Box::new(tauri::generate_handler![
        get_available_providers,
        search_suggestions,
        search,
        get_substance_data,
      ]),
    }
  }
}

impl<R: Runtime> Plugin<R> for Search<R> {
  fn name(&self) -> &'static str {
    "cabr2_search"
  }

  fn extend_api(&mut self, message: Invoke<R>) {
    (self.invoke_handler)(message)
  }

  fn created(&mut self, _: Window<R>) {
    log::trace!("plugin created");
  }
}
