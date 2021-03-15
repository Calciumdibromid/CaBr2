use std::{
  borrow::Borrow,
  collections::HashMap,
  sync::{Arc, Mutex},
};

use cabr2_types::SubstanceData;
use lazy_static::lazy_static;

use crate::types::{ProviderInfo, SearchArguments, SearchResponse, SearchType};

use super::{
  error::{Result, SearchError},
  types::Provider,
};

lazy_static! {
  pub static ref REGISTERED_PROVIDERS: Arc<Mutex<HashMap<&'static str, Box<dyn Provider + Send + Sync>>>> =
    Arc::new(Mutex::new(HashMap::new()));
}

pub fn get_available_providers() -> Result<Vec<ProviderInfo>> {
  let mut providers: Vec<ProviderInfo> = REGISTERED_PROVIDERS
    .lock()
    .expect("couldn't get lock for REGISTERED_PROVIDERS")
    .iter()
    .map(|(key, provider)| ProviderInfo {
      name: provider.get_name(),
      identifier: key.to_string(),
    })
    .collect();
  providers.push(ProviderInfo {
    identifier: "custom".into(),
    name: "Custom".into(),
  });

  Ok(providers)
}

pub fn get_quick_search_suggestions(provider: String, search_type: SearchType, pattern: String) -> Result<Vec<String>> {
  if pattern.len() < 2 {
    return Ok(vec![]);
  }

  if let Some(provider) = REGISTERED_PROVIDERS.lock().unwrap().get(&provider.borrow()) {
    return provider.get_quick_search_suggestions(search_type, pattern);
  }

  Err(SearchError::UnknownProvider(provider))
}

pub fn get_search_results(provider: String, arguments: SearchArguments) -> Result<Vec<SearchResponse>> {
  let arguments = SearchArguments {
    arguments: arguments
      .arguments
      .into_iter()
      .filter(|a| !a.pattern.is_empty())
      .collect(),
    ..arguments
  };

  if arguments.arguments.is_empty() {
    return Ok(vec![]);
  }

  if let Some(provider) = REGISTERED_PROVIDERS.lock().unwrap().get(&provider.borrow()) {
    return provider.get_search_results(arguments);
  }

  Err(SearchError::UnknownProvider(provider))
}

pub fn get_substance_data(provider: String, identifier: String) -> Result<SubstanceData> {
  if let Some(provider) = REGISTERED_PROVIDERS.lock().unwrap().get(&provider.borrow()) {
    return provider.get_substance_data(identifier);
  }

  Err(SearchError::UnknownProvider(provider))
}
