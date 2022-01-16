use serde_json::Value;
use tauri::{plugin::Plugin, Invoke, Runtime, Window};

use config::{
  error::Result,
  handler,
  types::{FrontendConfig, LocalizedStringsHeader},
  GHSSymbols,
};

#[tauri::command]
pub fn get_program_version() -> &'static str {
  env!("CARGO_PKG_VERSION")
}

#[tauri::command]
pub async fn get_config() -> Result<FrontendConfig> {
  handler::get_frontend_config().await
}

#[tauri::command]
pub async fn save_config(config: FrontendConfig) -> Result<()> {
  handler::save_frontend_config(config).await
}

#[tauri::command]
pub async fn get_hazard_symbols() -> Result<GHSSymbols> {
  handler::get_hazard_symbols().await
}

#[tauri::command]
pub async fn get_available_languages() -> Result<Vec<LocalizedStringsHeader>> {
  handler::get_available_languages().await
}

#[tauri::command]
pub async fn get_localized_strings(language: String) -> Result<Value> {
  handler::get_localized_strings(language).await
}

pub struct Config<R: Runtime> {
  invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync>,
}

impl<R: Runtime> std::default::Default for Config<R> {
  fn default() -> Self {
    Self {
      invoke_handler: Box::new(tauri::generate_handler![
        get_program_version,
        get_config,
        save_config,
        get_hazard_symbols,
        get_available_languages,
        get_localized_strings,
      ]),
    }
  }
}

impl<R: Runtime> Plugin<R> for Config<R> {
  fn name(&self) -> &'static str {
    "cabr2_config"
  }

  fn extend_api(&mut self, message: Invoke<R>) {
    (self.invoke_handler)(message)
  }

  fn created(&mut self, _: Window<R>) {
    log::trace!("plugin created");
  }
}
