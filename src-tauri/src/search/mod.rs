mod cmd;
mod error;
mod handler;

use tauri::plugin::Plugin;
use ureq::Agent;

use cmd::Cmd;

pub struct Search {
  agent: Agent,
}

impl Search {
  pub fn new() -> Self {
    Search {
      agent: Agent::new().build(),
    }
  }
}

impl Plugin for Search {
  fn extend_api(&self, webview: &mut tauri::Webview, payload: &str) -> Result<bool, String> {
    match serde_json::from_str(payload) {
      Err(e) => Err(e.to_string()),
      Ok(command) => {
        match command {
          Cmd::QuickSearchSuggestions {
            pattern,
            search_type,
            callback,
            error,
          } => {
            let agent = self.agent.clone();
            tauri::execute_promise(
              webview,
              move || {
                Ok(handler::quick_search_suggestions(
                  agent,
                  search_type,
                  pattern,
                ))
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
}
