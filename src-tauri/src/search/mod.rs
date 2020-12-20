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
      agent: Agent::new()
        // don't ask, just leave itZ
        // https://gestis.dguv.de/search -> webpack:///./src/api.ts?
        .auth_kind("Bearer", "dddiiasjhduuvnnasdkkwUUSHhjaPPKMasd")
        .build(),
    }
  }
}

impl Plugin for Search {
  fn extend_api(&self, webview: &mut tauri::Webview, payload: &str) -> Result<bool, String> {
    match serde_json::from_str(payload) {
      Err(e) => Err(e.to_string()),
      Ok(command) => {
        match command {
          Cmd::SearchSuggestions {
            pattern,
            search_type,
            callback,
            error,
          } => {
            let agent = self.agent.clone();
            tauri::execute_promise(
              webview,
              move || {
                Ok(handler::get_quick_search_suggestions(
                  agent,
                  search_type,
                  pattern,
                ))
              },
              callback,
              error,
            );
          }
          Cmd::Search {
            pattern,
            search_type,
            callback,
            error,
          } => {
            let agent = self.agent.clone();
            tauri::execute_promise(
              webview,
              move || Ok(handler::get_search_results(agent, search_type, pattern)),
              callback,
              error,
            );
          }
          Cmd::Article {
            zvg_number,
            callback,
            error,
          } => {
            let agent = self.agent.clone();
            tauri::execute_promise(
              webview,
              move || Ok(handler::get_article(agent, zvg_number)),
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
