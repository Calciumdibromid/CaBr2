mod impls;

use std::{env, future::Future};

use base64::encode;
use cfg_if::cfg_if;
use log::Level;
use serde::Serialize;
use wasm_bindgen::prelude::*;

use ::load_save::types::CaBr2Document;
use ::search::types::{SearchArguments, SearchType};

use crate::impls::{load_save, search};

type Result<T> = std::result::Result<T, JsValue>;

/// Must be run first to initialize all things on webassembly side.
#[wasm_bindgen]
pub async fn init() {
  cfg_if! {
    if #[cfg(feature = "debug_build")] {
      console_error_panic_hook::set_once();
      console_log::init_with_level(Level::Trace).expect("failed to initialize logger");
    } else {
      console_log::init_with_level(Level::Warn).expect("failed to initialize logger");
    }
  }

  log::debug!("Initializing WASM implementation...");

  // must be initialized first
  search::init().await;

  load_save::init(search::get_provider_mapping().await).await;
}

/// Converts a `CaBr2Document` into a `base64` encoded `string` that can be saved by the client.
///
/// May throw errors.
#[wasm_bindgen]
pub async fn save_document(file_type: String, document: String) -> Result<String> {
  // TODO change back to original signature when it is supported by `wasm-bindgen`
  // pub async fn save_document(file_type: String, document: String) -> Result<Vec<u8>> {
  let document: CaBr2Document = match serde_json::from_str(&document) {
    Ok(document) => document,
    Err(err) => return Err(JsValue::from(err.to_string())),
  };

  match load_save::save_document(file_type, document).await {
    Ok(res) => Ok(encode(res)),
    Err(err) => Err(JsValue::from(err.to_string())),
  }
}

/// Converts a binary array into a CaBr2Document.
///
/// May throw errors.
#[wasm_bindgen]
pub async fn load_document(file_type: String, doc: Vec<u8>) -> Result<String> {
  convert_result(load_save::load_document(file_type, doc)).await
}

/// Returns all available document types.
/// May has to be extended with types directly supported in JS.
///
/// May throw errors.
#[wasm_bindgen]
pub async fn get_available_document_types() -> Result<String> {
  convert_value(load_save::get_available_document_types()).await
}

/// Returns version as `string`
#[wasm_bindgen]
pub fn get_program_version() -> String {
  env!("CARGO_PKG_VERSION").to_string()
}

/// May throw errors.
#[wasm_bindgen]
pub async fn get_available_providers() -> Result<String> {
  convert_value(search::get_available_providers()).await
}

/// May throw errors.
#[wasm_bindgen]
pub async fn search_suggestions(provider: String, pattern: String, search_type: String) -> Result<String> {
  let search_type: SearchType = match serde_json::from_str(&search_type) {
    Ok(res) => res,
    Err(err) => return Err(JsValue::from(err.to_string())),
  };

  convert_result(search::search_suggestions(provider, pattern, search_type)).await
}

/// May throw errors.
#[wasm_bindgen]
pub async fn search_results(provider: String, arguments_: String) -> Result<String> {
  let arguments: SearchArguments = match serde_json::from_str(&arguments_) {
    Ok(res) => res,
    Err(err) => return Err(JsValue::from(err.to_string())),
  };

  convert_result(search::search_results(provider, arguments)).await
}

/// May throw errors.
#[wasm_bindgen]
pub async fn substance_data(provider: String, identifier: String) -> Result<String> {
  convert_result(search::get_substance_data(provider, identifier)).await
}

async fn convert_value<S>(future: impl Future<Output = S>) -> Result<String>
where
  S: Serialize,
{
  match serde_json::to_string(&future.await) {
    Ok(res) => Ok(res),
    Err(err) => Err(JsValue::from(err.to_string())),
  }
}

async fn convert_result<S, E>(future: impl Future<Output = std::result::Result<S, E>>) -> Result<String>
where
  S: Serialize,
  E: std::error::Error + Serialize,
{
  match future.await {
    Ok(data) => Ok(serde_json::to_string(&data).map_err(jsify)?),
    Err(err) => Err(JsValue::from_serde(&err).map_err(jsify)?),
  }
}

#[cfg(feature = "debug_build")]
fn jsify(err: serde_json::Error) -> JsValue {
  JsValue::from_str(&format!("{err:#?}"))
}

#[cfg(not(feature = "debug_build"))]
fn jsify(err: serde_json::Error) -> JsValue {
  JsValue::from_str(&format!("{err}"))
}
