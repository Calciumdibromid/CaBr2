use serde_json::Value;

use crate::{
  error::Result,
  handler,
  types::{FrontendConfig, GHSSymbols, LocalizedStringsHeader},
};

#[tauri::command]
pub fn get_program_version() -> &'static str {
  env!("CARGO_PKG_VERSION")
}

#[tauri::command]
pub fn get_config() -> Result<FrontendConfig> {
  handler::get_config()
}

#[tauri::command]
pub fn save_config(config: FrontendConfig) -> Result<()> {
  handler::save_config(config)
}

#[tauri::command]
pub fn get_hazard_symbols() -> Result<GHSSymbols> {
  handler::get_hazard_symbols()
}

#[tauri::command]
pub fn get_available_languages() -> Result<Vec<LocalizedStringsHeader>> {
  handler::get_available_languages()
}

#[tauri::command]
pub fn get_localized_strings(language: String) -> Result<Value> {
  handler::get_localized_strings(language)
}

#[tauri::command]
pub fn get_prompt_html(name: String) -> Result<String> {
  handler::get_prompt_html(name)
}
