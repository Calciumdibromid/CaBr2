#![allow(clippy::new_without_default)]
#![allow(clippy::unnecessary_unwrap)]
#![allow(clippy::upper_case_acronyms)]

mod cmd;
mod error;
mod handler;
mod types;

mod gestis;

use tauri::plugin::Plugin;
use ureq::AgentBuilder;

use cmd::Cmd;

pub struct Search;

impl Search {
  pub fn new() -> Search {
    let agent = AgentBuilder::new()
      .user_agent(&format!("cabr2/v{}", env!("CARGO_PKG_VERSION")))
      .build();

    let mut providers = handler::REGISTERED_PROVIDERS.lock().unwrap();
    providers.insert("gestis", Box::new(gestis::Gestis::new(agent.clone())));

    Search
  }
}

impl Plugin for Search {
  fn extend_api(&self, webview: &mut tauri::Webview, payload: &str) -> Result<bool, String> {
    match serde_json::from_str(payload) {
      Err(e) => Err(e.to_string()),
      Ok(command) => {
        log::trace!("command: {:?}", &command);
        match command {
          Cmd::GetAvailableProviders { callback, error } => {
            tauri::execute_promise(
              webview,
              move || match handler::get_available_providers() {
                Ok(res) => Ok(res),
                Err(e) => Err(e.into()),
              },
              callback,
              error,
            );
          }
          Cmd::SearchSuggestions {
            provider,
            pattern,
            search_type,
            callback,
            error,
          } => {
            tauri::execute_promise(
              webview,
              move || match handler::get_quick_search_suggestions(provider, search_type, pattern) {
                Ok(res) => Ok(res),
                Err(e) => Err(e.into()),
              },
              callback,
              error,
            );
          }
          Cmd::Search {
            provider,
            arguments,
            callback,
            error,
          } => {
            tauri::execute_promise(
              webview,
              move || match handler::get_search_results(provider, arguments) {
                Ok(res) => Ok(res),
                Err(e) => Err(e.into()),
              },
              callback,
              error,
            );
          }
          Cmd::GetSubstanceData {
            provider,
            identifier,
            callback,
            error,
          } => {
            tauri::execute_promise(
              webview,
              move || match handler::get_substance_data(provider, identifier) {
                Ok(res) => Ok(res),
                Err(e) => Err(e.into()),
              },
              callback,
              error,
            );
          }
        }
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
