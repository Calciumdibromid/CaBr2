use std::{borrow::Borrow, collections::HashMap};

use ::types::SubstanceData;
use cfg_if::cfg_if;
use lazy_static::lazy_static;

use types::{lock::RwLockWrapper, ProviderMapping};

use crate::{
  error::{Result, SearchError},
  types::{Provider, ProviderInfo, SearchArguments, SearchResponse, SearchType},
};

lazy_static! {
  pub static ref REGISTERED_PROVIDERS: RwLockWrapper<HashMap<&'static str, Box<dyn Provider + Send + Sync>>> =
    RwLockWrapper::new(HashMap::new());
}

pub async fn init_providers(_version: &str) -> Result<()> {
  log::trace!("initializing providers");
  let mut providers = REGISTERED_PROVIDERS.write().await;

  #[cfg(feature = "gestis")]
  {
    cfg_if! {
      if #[cfg(target_family = "wasm")] {
        let client = reqwest::ClientBuilder::new().build()?;
      } else {
        let client = reqwest::ClientBuilder::new().user_agent(&format!("cabr2/v{}", _version)).build()?;
      }
    }

    providers.insert("gestis", Box::new(crate::gestis::Gestis::new(client)));
  }

  log::trace!("dropping provider lock...");
  Ok(())
}

pub async fn get_provider_mapping() -> ProviderMapping {
  let providers = REGISTERED_PROVIDERS.read().await;

  let mut mapping = HashMap::new();
  for (id, provider) in providers.iter() {
    mapping.insert(id.to_string(), provider.get_name());
  }

  mapping
}

pub async fn get_available_providers() -> Vec<ProviderInfo> {
  let providers = REGISTERED_PROVIDERS.read().await;

  let mut providers: Vec<ProviderInfo> = providers
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

  providers
}

pub async fn get_quick_search_suggestions(
  provider: String,
  search_type: SearchType,
  pattern: String,
) -> Result<Vec<String>> {
  if pattern.len() < 2 {
    return Ok(vec![]);
  }

  let providers = REGISTERED_PROVIDERS.read().await;

  if let Some(provider) = providers.get(&provider.borrow()) {
    return provider.get_quick_search_suggestions(search_type, pattern).await;
  }

  Err(SearchError::UnknownProvider(provider))
}

pub async fn get_search_results(provider: String, arguments: SearchArguments) -> Result<Vec<SearchResponse>> {
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

  let providers = REGISTERED_PROVIDERS.read().await;

  if let Some(provider) = providers.get(&provider.borrow()) {
    return provider.get_search_results(arguments).await;
  }

  Err(SearchError::UnknownProvider(provider))
}

pub async fn get_substance_data(provider: String, identifier: String) -> Result<SubstanceData> {
  let providers = REGISTERED_PROVIDERS.read().await;

  if let Some(provider) = providers.get(&provider.borrow()) {
    return provider.get_substance_data(identifier).await;
  }

  Err(SearchError::UnknownProvider(provider))
}
