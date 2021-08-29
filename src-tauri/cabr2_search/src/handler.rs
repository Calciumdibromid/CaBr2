#[cfg(feature = "wasm")]
use std::sync::RwLock;
use std::{borrow::Borrow, collections::HashMap};

use cfg_if::cfg_if;
use lazy_static::lazy_static;
#[cfg(not(feature = "wasm"))]
use tokio::sync::RwLock;

use cabr2_types::SubstanceData;

use crate::{
  error::{Result, SearchError},
  types::{Provider, ProviderInfo, SearchArguments, SearchResponse, SearchType},
};

lazy_static! {
  pub static ref REGISTERED_PROVIDERS: RwLock<HashMap<&'static str, Box<dyn Provider + Send + Sync>>> =
    RwLock::new(HashMap::new());
}

#[cfg(all(feature = "gestis", not(feature = "wasm")))]
const USER_AGENT: &str = concat!("cabr2/v", env!("CARGO_PKG_VERSION"));

pub async fn init_providers() -> Result<()> {
  let mut _providers;
  cfg_if! {
    if #[cfg(not(feature = "wasm"))]{
      _providers = REGISTERED_PROVIDERS.write().await;
    } else {
      _providers = REGISTERED_PROVIDERS.write().expect("failed to get write lock");
    }
  }

  #[cfg(feature = "gestis")]
  {
    #[cfg(not(feature = "wasm"))]
    let agent = reqwest::ClientBuilder::new().user_agent(USER_AGENT).build()?;
    #[cfg(feature = "wasm")]
    let agent = reqwest::ClientBuilder::new().build()?;

    _providers.insert("gestis", Box::new(crate::gestis::Gestis::new(agent)));
  }

  Ok(())
}

pub async fn get_provider_mapping() -> HashMap<String, String> {
  let providers;
  cfg_if! {
    if #[cfg(not(feature = "wasm"))]{
      providers = REGISTERED_PROVIDERS.write().await;
    } else {
      providers = REGISTERED_PROVIDERS.write().expect("failed to get write lock");
    }
  }

  let mut mapping = HashMap::new();
  for (id, provider) in providers.iter() {
    mapping.insert(id.to_string(), provider.get_name());
  }

  mapping
}

pub async fn get_available_providers() -> Vec<ProviderInfo> {
  let providers;
  cfg_if! {
    if #[cfg(not(feature = "wasm"))]{
      providers = REGISTERED_PROVIDERS.write().await;
    } else {
      providers = REGISTERED_PROVIDERS.write().expect("failed to get write lock");
    }
  }

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

  let providers;
  cfg_if! {
    if #[cfg(not(feature = "wasm"))]{
      providers = REGISTERED_PROVIDERS.write().await;
    } else {
      providers = REGISTERED_PROVIDERS.write().expect("failed to get write lock");
    }
  }

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

  let providers;
  cfg_if! {
    if #[cfg(not(feature = "wasm"))]{
      providers = REGISTERED_PROVIDERS.write().await;
    } else {
      providers = REGISTERED_PROVIDERS.write().expect("failed to get write lock");
    }
  }

  if let Some(provider) = providers.get(&provider.borrow()) {
    return provider.get_search_results(arguments).await;
  }

  Err(SearchError::UnknownProvider(provider))
}

pub async fn get_substance_data(provider: String, identifier: String) -> Result<SubstanceData> {
  let providers;
  cfg_if! {
    if #[cfg(not(feature = "wasm"))]{
      providers = REGISTERED_PROVIDERS.write().await;
    } else {
      providers = REGISTERED_PROVIDERS.write().expect("failed to get write lock");
    }
  }

  if let Some(provider) = providers.get(&provider.borrow()) {
    return provider.get_substance_data(identifier).await;
  }

  Err(SearchError::UnknownProvider(provider))
}
