#![allow(clippy::upper_case_acronyms)]

mod cmd;
mod error;
mod handler;
mod types;

use tauri::{plugin::Plugin, InvokeMessage, Params, Window};

pub use handler::{get_hazard_symbols, read_config, write_config, DATA_DIR, PROJECT_DIRS, TMP_DIR};
pub use types::{BackendConfig, GHSSymbols};

pub struct Config<M: Params> {
  invoke_handler: Box<dyn Fn(InvokeMessage<M>) + Send + Sync>,
}

impl<M: Params> std::default::Default for Config<M> {
  fn default() -> Self {
    use cmd::*;
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

  fn extend_api(&mut self, message: InvokeMessage<M>) {
    (self.invoke_handler)(message)
  }

  fn created(&mut self, _: Window<M>) {
    log::trace!("plugin created");
  }
}
