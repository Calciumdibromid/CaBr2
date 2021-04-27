#![allow(clippy::new_without_default)]
#![allow(clippy::unnecessary_unwrap)]
#![allow(clippy::upper_case_acronyms)]

#[cfg(feature = "tauri_plugin")]
mod cmd;
pub mod error;
#[cfg(feature = "gestis")]
pub mod gestis;
#[cfg(feature = "handler")]
mod handler;
pub mod types;

#[cfg(feature = "tauri_plugin")]
pub use plugin::Search;

#[cfg(feature = "tauri_plugin")]
mod plugin {
  use std::collections::HashMap;

  use tauri::{plugin::Plugin, InvokeMessage, Params, Window};
  use ureq::AgentBuilder;

  #[cfg(feature = "gestis")]
  use super::gestis;
  // handler is a required feature for tauri_plugin
  use super::handler;

  pub struct Search<M: Params> {
    invoke_handler: Box<dyn Fn(InvokeMessage<M>) + Send + Sync>,
  }

  impl<M: Params> Search<M> {
    pub fn new() -> Self {
      let agent = AgentBuilder::new()
        .user_agent(&format!("cabr2/v{}", env!("CARGO_PKG_VERSION")))
        .build();

      let mut providers = handler::REGISTERED_PROVIDERS.lock().unwrap();
      #[cfg(feature = "gestis")]
      providers.insert("gestis", Box::new(gestis::Gestis::new(agent)));

      use super::cmd::*;
      Search {
        invoke_handler: Box::new(tauri::generate_handler![
          get_available_providers,
          search_suggestions,
          search,
          get_substance_data,
        ]),
      }
    }

    pub fn get_provider_mapping(&self) -> HashMap<String, String> {
      let providers = handler::REGISTERED_PROVIDERS.lock().unwrap();
      let mut mapping = HashMap::new();
      for (id, provider) in providers.iter() {
        mapping.insert(id.to_string(), provider.get_name());
      }

      mapping
    }
  }

  impl<M: Params> Plugin<M> for Search<M> {
    fn name(&self) -> &'static str {
      "cabr2_search"
    }

    fn extend_api(&mut self, message: InvokeMessage<M>) {
      (self.invoke_handler)(message)
    }

    fn created(&mut self, _: Window<M>) {
      log::trace!("plugin created");
    }
  }
}
