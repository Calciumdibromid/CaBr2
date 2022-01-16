use std::{collections::HashMap, convert::Infallible};

use serde::Deserialize;
use warp::{hyper::StatusCode, Reply};

use search::{
  error::SearchError,
  handler,
  types::{SearchArgument, SearchArguments},
};

use super::types::generate_error_reply;

pub async fn init() {
  handler::init_providers().await.unwrap();
}

pub async fn get_provider_mapping() -> HashMap<String, String> {
  let providers = handler::REGISTERED_PROVIDERS.read().await;
  let mut mapping = HashMap::new();
  for (id, provider) in providers.iter() {
    mapping.insert(id.to_string(), provider.get_name());
  }

  mapping
}

pub async fn handle_available_providers() -> Result<impl Reply, Infallible> {
  let res = handler::get_available_providers().await;
  Ok(warp::reply::with_status(warp::reply::json(&res), StatusCode::OK))
}

pub async fn handle_suggestions(body: SuggestionBody) -> Result<impl Reply, Infallible> {
  match handler::get_quick_search_suggestions(
    body.provider,
    body.search_argument.search_type,
    body.search_argument.pattern,
  )
  .await
  {
    Ok(res) => Ok(warp::reply::with_status(warp::reply::json(&res), StatusCode::OK)),
    Err(SearchError::UnknownProvider(provider)) => {
      let message = format!("unknown provider: {}", provider);
      log::error!("{}", message);
      Ok(generate_error_reply(StatusCode::BAD_REQUEST, message))
    }
    Err(err) => {
      log::error!("{:?}", err);
      Ok(generate_error_reply(
        StatusCode::INTERNAL_SERVER_ERROR,
        "failed to get suggestions".to_string(),
      ))
    }
  }
}

pub async fn handle_results(body: ResultBody) -> Result<impl Reply, Infallible> {
  match handler::get_search_results(body.provider, body.search_arguments).await {
    Ok(res) => Ok(warp::reply::with_status(warp::reply::json(&res), StatusCode::OK)),
    Err(SearchError::UnknownProvider(provider)) => {
      let message = format!("unknown provider: {}", provider);
      log::error!("{}", message);
      Ok(generate_error_reply(StatusCode::BAD_REQUEST, message))
    }
    Err(err) => {
      log::error!("{:?}", err);
      Ok(generate_error_reply(
        StatusCode::INTERNAL_SERVER_ERROR,
        "failed to get search results".to_string(),
      ))
    }
  }
}

pub async fn handle_substances(body: SubstanceBody) -> Result<impl Reply, Infallible> {
  match handler::get_substance_data(body.provider, body.identifier).await {
    Ok(res) => Ok(warp::reply::with_status(warp::reply::json(&res), StatusCode::OK)),
    Err(SearchError::UnknownProvider(provider)) => {
      let message = format!("unknown provider: {}", provider);
      log::error!("{}", message);
      Ok(generate_error_reply(StatusCode::BAD_REQUEST, message))
    }
    Err(err) => {
      log::error!("{:?}", err);
      Ok(generate_error_reply(
        StatusCode::INTERNAL_SERVER_ERROR,
        "failed to get substance data".to_string(),
      ))
    }
  }
}

// Body definitions

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SuggestionBody {
  provider: String,
  search_argument: SearchArgument,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ResultBody {
  provider: String,
  search_arguments: SearchArguments,
}

#[derive(Debug, Deserialize)]
pub struct SubstanceBody {
  provider: String,
  identifier: String,
}
