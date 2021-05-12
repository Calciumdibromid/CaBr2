use std::collections::HashMap;

use tauri::{plugin::Plugin, InvokeMessage, Params, Window};
use ureq::AgentBuilder;

use cabr2_types::SubstanceData;

#[cfg(feature = "gestis")]
use crate::gestis;
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

pub struct Search<M: Params> {
  invoke_handler: Box<dyn Fn(InvokeMessage<M>) + Send + Sync>,
}

impl<M: Params> Search<M> {
  pub fn new() -> Self {
    let agent = AgentBuilder::new()
      .user_agent(&format!("cabr2/v{}", env!("CARGO_PKG_VERSION")))
      .build();

    let mut providers = handler::REGISTERED_PROVIDERS.lock().unwrap();
    #[cfg(feature = "gestis")]
    providers.insert("gestis", Box::new(gestis::Gestis::new(agent)));

    use super::plugin::*;
    Search {
      invoke_handler: Box::new(tauri::generate_handler![
        get_available_providers,
        search_suggestions,
        search,
        get_substance_data,
      ]),
    }
  }

  pub fn get_provider_mapping(&self) -> HashMap<String, String> {
    let providers = handler::REGISTERED_PROVIDERS.lock().unwrap();
    let mut mapping = HashMap::new();
    for (id, provider) in providers.iter() {
      mapping.insert(id.to_string(), provider.get_name());
    }

    mapping
  }
}

impl<M: Params> Plugin<M> for Search<M> {
  fn name(&self) -> &'static str {
    "cabr2_search"
  }

  fn extend_api(&mut self, message: InvokeMessage<M>) {
    (self.invoke_handler)(message)
  }

  fn created(&mut self, _: Window<M>) {
    log::trace!("plugin created");
  }
}
