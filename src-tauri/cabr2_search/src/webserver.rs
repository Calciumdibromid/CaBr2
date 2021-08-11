use std::{collections::HashMap, convert::Infallible};

use serde::Deserialize;
use serde_json::Value;
use warp::{hyper::StatusCode, Reply};

use crate::{
  handler,
  types::{SearchArgument, SearchArguments},
};

pub async fn init() {
  handler::init_providers().await;
}

pub async fn get_provider_mapping() -> HashMap<String, String> {
  let providers = handler::REGISTERED_PROVIDERS.lock().await;
  let mut mapping = HashMap::new();
  for (id, provider) in providers.iter() {
    mapping.insert(id.to_string(), provider.get_name());
  }

  mapping
}

pub async fn handle_available_providers() -> Result<impl Reply, Infallible> {
  match handler::get_available_providers().await {
    Ok(res) => Ok(warp::reply::with_status(warp::reply::json(&res), StatusCode::OK)),
    Err(err) => Ok(warp::reply::with_status(
      warp::reply::json(&Value::String(err.to_string())),
      StatusCode::BAD_REQUEST,
    )),
  }
}

pub async fn handle_suggestions(body: SuggenstionBody) -> Result<impl Reply, Infallible> {
  match handler::get_quick_search_suggestions(
    body.provider,
    body.search_argument.search_type,
    body.search_argument.pattern,
  )
  .await
  {
    Ok(res) => Ok(warp::reply::with_status(warp::reply::json(&res), StatusCode::OK)),
    Err(err) => Ok(warp::reply::with_status(
      warp::reply::json(&Value::String(err.to_string())),
      StatusCode::BAD_REQUEST,
    )),
  }
}

pub async fn handle_results(body: ResultBody) -> Result<impl Reply, Infallible> {
  match handler::get_search_results(body.provider, body.search_arguments).await {
    Ok(res) => Ok(warp::reply::with_status(warp::reply::json(&res), StatusCode::OK)),
    Err(err) => Ok(warp::reply::with_status(
      warp::reply::json(&Value::String(err.to_string())),
      StatusCode::BAD_REQUEST,
    )),
  }
}

pub async fn handle_substances(body: SubstanceBody) -> Result<impl Reply, Infallible> {
  match handler::get_substance_data(body.provider, body.identifier).await {
    Ok(res) => Ok(warp::reply::with_status(warp::reply::json(&res), StatusCode::OK)),
    Err(err) => Ok(warp::reply::with_status(
      warp::reply::json(&Value::String(err.to_string())),
      StatusCode::BAD_REQUEST,
    )),
  }
}

// Body definitions

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SuggenstionBody {
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