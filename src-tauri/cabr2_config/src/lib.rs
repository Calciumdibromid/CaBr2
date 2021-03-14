mod cmd;
mod error;
mod handler;
mod types;

use std::{env, path::PathBuf};

use directories_next::ProjectDirs;
use lazy_static::lazy_static;
use tauri::{self, plugin::Plugin};

use cmd::Cmd;
pub use handler::{get_hazard_symbols, read_config, write_config};
pub use types::{BackendConfig, GHSSymbols};

lazy_static! {
  pub static ref PROJECT_DIRS: ProjectDirs = ProjectDirs::from("de", "Calciumdibromid", "CaBr2").unwrap();
  pub static ref DATA_DIR: PathBuf = get_program_data_dir();
  pub static ref TMP_DIR: PathBuf = env::temp_dir();
}

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

fn get_program_data_dir() -> PathBuf {
  #[cfg(not(debug_assertions))]
  {
    #[cfg(not(feature = "portable"))]
    {
      #[cfg(target_os = "linux")]
      {
        log::trace!("data path: linux");
        return PathBuf::from("/usr/lib/cabr2/");
      }

      #[cfg(target_os = "macos")]
      {
        log::trace!("data path: macos");
        unimplemented!();
      }

      #[cfg(target_os = "windows")]
      {
        log::trace!("data path: windows");
        return PathBuf::from(env::args().next().unwrap())
          .parent()
          .unwrap()
          .to_path_buf();
      }
    }

    #[cfg(feature = "portable")]
    {
      log::trace!("data path: portable");
      return PathBuf::from(env::args().next().unwrap())
        .parent()
        .unwrap()
        .to_path_buf();
    }
  }

  #[cfg(debug_assertions)]
  {
    log::trace!("data path: debug");
    let mut program_path = PathBuf::from(env::args().next().unwrap())
      .parent()
      .unwrap()
      .to_path_buf();
    // git repo root
    program_path.push("../../../");
    program_path.canonicalize().unwrap()
  }
}
