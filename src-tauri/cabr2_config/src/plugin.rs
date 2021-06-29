use serde_json::Value;
use tauri::{plugin::Plugin, Invoke, Params, Window};

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

pub struct Config<M: Params> {
  invoke_handler: Box<dyn Fn(Invoke<M>) + Send + Sync>,
}

impl<M: Params> std::default::Default for Config<M> {
  fn default() -> Self {
    Self {
      invoke_handler: Box::new(tauri::generate_handler![
        get_program_version,
        get_config,
        save_config,
        get_hazard_symbols,
        get_available_languages,
        get_localized_strings,
        get_prompt_html,
      ]),
    }
  }
}

impl<M: Params> Plugin<M> for Config<M> {
  fn name(&self) -> &'static str {
    "cabr2_config"
  }

  fn extend_api(&mut self, message: Invoke<M>) {
    (self.invoke_handler)(message)
  }

  fn created(&mut self, _: Window<M>) {
    log::trace!("plugin created");
  }
}
