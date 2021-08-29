use std::env;

use base64::encode;
use log::Level;
use wasm_bindgen::prelude::*;

use cabr2_load_save::wasm::CaBr2Document;
use cabr2_search::types::{SearchArguments, SearchType};

type Result<T> = std::result::Result<T, JsValue>;

/// Must be run first to initialize all things.
#[wasm_bindgen]
pub async fn init() {
  #[cfg(feature = "debug_build")]
  {
    console_error_panic_hook::set_once();
    console_log::init_with_level(Level::Trace).expect("failed to initialize logger");
  }

  #[cfg(not(feature = "debug_build"))]
  {
    console_log::init_with_level(Level::Warn).expect("failed to initialize logger");
  }

  log::debug!("Initializing WASM implementation...");

  // must be initialized first
  cabr2_search::wasm::init().await;

  cabr2_load_save::wasm::init(cabr2_search::wasm::get_provider_mapping().await).await;
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

  match cabr2_load_save::wasm::save_document(file_type, document).await {
    Ok(res) => Ok(encode(res)),
    Err(err) => Err(JsValue::from(err.to_string())),
  }
}

/// Converts a binary array into a CaBr2Document.
///
/// May throw errors.
#[wasm_bindgen]
pub async fn load_document(file_type: String, doc: Vec<u8>) -> Result<String> {
  let document = match cabr2_load_save::wasm::load_document(file_type, doc).await {
    Ok(document) => document,
    Err(err) => return Err(JsValue::from(err.to_string())),
  };

  match serde_json::to_string(&document) {
    Ok(res) => Ok(res),
    Err(err) => Err(JsValue::from(err.to_string())),
  }
}

/// Returns all available document types.
/// May has to be extended with types directly supported in JS.
///
/// May throw errors.
#[wasm_bindgen]
pub async fn get_available_document_types() -> Result<String> {
  let types = match cabr2_load_save::wasm::get_available_document_types().await {
    Ok(types) => types,
    Err(err) => return Err(JsValue::from(err.to_string())),
  };

  match serde_json::to_string(&types) {
    Ok(res) => Ok(res),
    Err(err) => Err(JsValue::from(err.to_string())),
  }
}

#[wasm_bindgen]
pub fn get_program_version() -> String {
  env!("CARGO_PKG_VERSION").to_string()
}

#[wasm_bindgen]
pub async fn get_available_providers() -> Result<String> {
  let providers = cabr2_search::wasm::get_available_providers().await;

  match serde_json::to_string(&providers) {
    Ok(res) => Ok(res),
    Err(err) => Err(JsValue::from(err.to_string())),
  }
}

#[wasm_bindgen]
pub async fn search_suggestions(provider: String, pattern: String, search_type: String) -> Result<String> {
  let search_type: SearchType = match serde_json::from_str(&search_type) {
    Ok(res) => res,
    Err(err) => return Err(JsValue::from(err.to_string())),
  };

  let suggestions = match cabr2_search::wasm::search_suggestions(provider, pattern, search_type).await {
    Ok(suggestions) => suggestions,
    Err(err) => return Err(JsValue::from(err.to_string())),
  };

  match serde_json::to_string(&suggestions) {
    Ok(res) => Ok(res),
    Err(err) => Err(JsValue::from(err.to_string())),
  }
}

#[wasm_bindgen]
pub async fn search_results(provider: String, arguments_: String) -> Result<String> {
  let arguments: SearchArguments = match serde_json::from_str(&arguments_) {
    Ok(res) => res,
    Err(err) => return Err(JsValue::from(err.to_string())),
  };

  let results = match cabr2_search::wasm::search_results(provider, arguments).await {
    Ok(results) => results,
    Err(err) => return Err(JsValue::from(err.to_string())),
  };

  match serde_json::to_string(&results) {
    Ok(res) => Ok(res),
    Err(err) => Err(JsValue::from(err.to_string())),
  }
}

#[wasm_bindgen]
pub async fn substance_data(provider: String, identifier: String) -> Result<String> {
  let substance_data = match cabr2_search::wasm::get_substance_data(provider, identifier).await {
    Ok(substance_data) => substance_data,
    Err(err) => return Err(JsValue::from(err.to_string())),
  };

  match serde_json::to_string(&substance_data) {
    Ok(res) => Ok(res),
    Err(err) => Err(JsValue::from(err.to_string())),
  }
}
