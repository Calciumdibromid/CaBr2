mod cmd;
mod error;
mod handler;
mod types;

use tauri::{self, plugin::Plugin};

use cmd::Cmd;
pub use handler::{read_config, write_config};
pub use types::TomlConfig;

pub struct Config;

impl Plugin for Config {
  fn extend_api(&self, webview: &mut tauri::Webview, payload: &str) -> Result<bool, String> {
    match serde_json::from_str(payload) {
      Err(e) => Err(e.to_string()),
      Ok(command) => {
        log::trace!("command: {:?}", &command);
        match command {
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
        }
        // dispatch of async request should always succeed
        Ok(true)
      }
    }
  }
}
