mod cmd;
mod error;
mod handler;
mod types;

use std::{env, path::PathBuf};

use directories_next::ProjectDirs;
use lazy_static::lazy_static;
use tauri::{self, plugin::Plugin};

use cmd::Cmd;
pub use handler::{read_config, write_config};
pub use types::TomlConfig;

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

fn get_program_data_dir() -> PathBuf {
  #[cfg(not(debug_assertions))]
  {
    #[cfg(not(feature = "portable"))]
    {
      #[cfg(target_os = "linux")]
      return PathBuf::from("/usr/lib/cabr2/");

      #[cfg(target_os = "macos")]
      unimplemented!();

      #[cfg(target_os = "windows")]
      return PathBuf::from(env::args().next().unwrap())
        .parent()
        .unwrap()
        .to_path_buf();
    }

    #[cfg(feature = "portable")]
    return PathBuf::from(env::args().next().unwrap())
      .parent()
      .unwrap()
      .to_path_buf();
  }

  #[cfg(debug_assertions)]
  {
    let mut program_path = PathBuf::from(env::args().next().unwrap())
      .parent()
      .unwrap()
      .to_path_buf();
    // git repo root
    program_path.push("../../../");
    program_path.canonicalize().unwrap()
  }
}
