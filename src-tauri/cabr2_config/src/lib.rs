mod cmd;
mod error;
mod handler;
mod types;

use std::env;

use tauri::{self, plugin::Plugin};

use cmd::Cmd;

pub use handler::{get_hazard_symbols, read_config, write_config, DATA_DIR, PROJECT_DIRS, TMP_DIR};
pub use types::{BackendConfig, GHSSymbols};

pub struct Config;

impl Plugin for Config {
  fn extend_api(&self, webview: &mut tauri::Webview, payload: &str) -> Result<bool, String> {
    match serde_json::from_str(payload) {
      Err(e) => Err(e.to_string()),
      Ok(command) => {
        log::trace!("command: {:?}", &command);
        match command {
          Cmd::GetProgramVersion { callback, error } => {
            tauri::execute_promise(webview, move || Ok(env!("CARGO_PKG_VERSION")), callback, error);
          }
          Cmd::GetConfig { callback, error } => {
            tauri::execute_promise(
              webview,
              move || match handler::get_config() {
                Ok(res) => Ok(res),
                Err(e) => Err(e.into()),
              },
              callback,
              error,
            );
          }
          Cmd::SaveConfig {
            config,
            callback,
            error,
          } => {
            tauri::execute_promise(
              webview,
              move || match handler::save_config(config) {
                Ok(_) => Ok(()),
                Err(e) => Err(e.into()),
              },
              callback,
              error,
            );
          }
          Cmd::GetHazardSymbols { callback, error } => {
            tauri::execute_promise(
              webview,
              move || match handler::get_hazard_symbols() {
                Ok(res) => Ok(res),
                Err(e) => Err(e.into()),
              },
              callback,
              error,
            );
          }
          Cmd::GetAvailableLanguages { callback, error } => {
            tauri::execute_promise(
              webview,
              move || match handler::get_available_languages() {
                Ok(res) => Ok(res),
                Err(e) => Err(e.into()),
              },
              callback,
              error,
            );
          }
          Cmd::GetLocalizedStrings {
            language,
            callback,
            error,
          } => {
            tauri::execute_promise(
              webview,
              move || match handler::get_localized_strings(language) {
                Ok(res) => Ok(res),
                Err(e) => Err(e.into()),
              },
              callback,
              error,
            );
          }
          Cmd::GetPromptHtml {
            name,
            callback,
            error,
          } => {
            tauri::execute_promise(
              webview,
              move || match handler::get_prompt_html(name) {
                Ok(res) => Ok(res),
                Err(e) => Err(e.into()),
              },
              callback,
              error,
            );
          }
        }
        // dispatch of async request should always succeed
        Ok(true)
      }
    }
  }

  fn created(&self, _: &mut tauri::Webview<'_>) {
    log::trace!("plugin created");
  }

  fn ready(&self, _: &mut tauri::Webview<'_>) {
    log::trace!("plugin ready");
  }
}
