use std::convert::Infallible;

use serde::Deserialize;
use warp::{hyper::StatusCode, Reply};

use cabr2_types::webserver::generate_error_reply;

use crate::handler;

pub async fn handle_hazard_symbols() -> Result<impl Reply, Infallible> {
  match handler::get_hazard_symbols().await {
    Ok(res) => Ok(warp::reply::with_status(warp::reply::json(&res), StatusCode::OK)),
    Err(err) => {
      log::error!("{:?}", err);
      Ok(generate_error_reply(
        StatusCode::INTERNAL_SERVER_ERROR,
        "failed to load hazard symbols".to_string(),
      ))
    }
  }
}

pub async fn handle_program_version() -> Result<impl Reply, Infallible> {
  Ok(warp::reply::with_status(
    warp::reply::json(&env!("CARGO_PKG_VERSION")),
    StatusCode::OK,
  ))
}

pub async fn handle_available_languages() -> Result<impl Reply, Infallible> {
  match handler::get_available_languages().await {
    Ok(res) => Ok(warp::reply::with_status(warp::reply::json(&res), StatusCode::OK)),
    Err(err) => {
      log::error!("{:?}", err);
      Ok(generate_error_reply(
        StatusCode::INTERNAL_SERVER_ERROR,
        "failed to get available languages".to_string(),
      ))
    }
  }
}

pub async fn handle_localized_strings(body: LocalizedStringsBody) -> Result<impl Reply, Infallible> {
  match handler::get_localized_strings(body.language).await {
    Ok(res) => Ok(warp::reply::with_status(warp::reply::json(&res), StatusCode::OK)),
    Err(err) => {
      log::error!("{:?}", err);
      Ok(generate_error_reply(
        StatusCode::INTERNAL_SERVER_ERROR,
        "failed to get localized strings".to_string(),
      ))
    }
  }
}

// Body definitions

#[derive(Debug, Deserialize)]
pub struct PromptHtmlBody {
  name: String,
}

#[derive(Debug, Deserialize)]
pub struct LocalizedStringsBody {
  language: String,
}
