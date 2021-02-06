mod cmd;
mod error;
mod handler;
mod types;
mod xml_parser;

use tauri::plugin::Plugin;
use ureq::Agent;

use cmd::Cmd;

pub struct Gestis {
  agent: Agent,
}

impl Gestis {
  pub fn new() -> Self {
    Gestis {
      agent: Agent::new()
        // don't ask, just leave it
        // https://gestis.dguv.de/search -> webpack:///./src/api.ts?
        .auth_kind("Bearer", "dddiiasjhduuvnnasdkkwUUSHhjaPPKMasd")
        .build(),
    }
  }
}

impl Plugin for Gestis {
  fn extend_api(&self, webview: &mut tauri::Webview, payload: &str) -> Result<bool, String> {
    match serde_json::from_str(payload) {
      Err(e) => Err(e.to_string()),
      Ok(command) => {
        log::trace!("command: {:?}", &command);
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
              move || match handler::get_quick_search_suggestions(agent, search_type, pattern) {
                Ok(res) => Ok(res),
                Err(e) => Err(e.into()),
              },
              callback,
              error,
            );
          }
          Cmd::Search {
            arguments,
            callback,
            error,
          } => {
            let agent = self.agent.clone();
            tauri::execute_promise(
              webview,
              move || match handler::get_search_results(agent, arguments) {
                Ok(res) => Ok(res),
                Err(e) => Err(e.into()),
              },
              callback,
              error,
            );
          }
          Cmd::GetSubstanceData {
            zvg_number,
            callback,
            error,
          } => {
            let agent = self.agent.clone();
            tauri::execute_promise(
              webview,
              move || match handler::get_substance_data(agent, zvg_number) {
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
}
