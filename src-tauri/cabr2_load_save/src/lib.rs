#![allow(clippy::new_without_default)]
#![allow(clippy::unnecessary_unwrap)]
#![allow(clippy::upper_case_acronyms)]

mod cmd;
mod error;
mod handler;
mod types;

mod beryllium;
mod cabr2;
mod pdf;

use tauri::plugin::Plugin;

use cabr2_types::ProviderMapping;

use cmd::Cmd;

pub struct LoadSave;

impl LoadSave {
  pub fn new(provider_mapping: ProviderMapping) -> LoadSave {
    let mut loaders = handler::REGISTERED_LOADERS.lock().unwrap();
    loaders.insert("cb2", Box::new(cabr2::CaBr2));
    loaders.insert("be", Box::new(beryllium::Beryllium));

    let mut savers = handler::REGISTERED_SAVERS.lock().unwrap();
    savers.insert("cb2", Box::new(cabr2::CaBr2));
    savers.insert("pdf", Box::new(pdf::PDF::new(provider_mapping)));

    LoadSave
  }
}

impl Plugin for LoadSave {
  fn extend_api(&self, webview: &mut tauri::Webview, payload: &str) -> Result<bool, String> {
    match serde_json::from_str(payload) {
      Err(e) => Err(e.to_string()),
      Ok(command) => {
        log::trace!("command: {:?}", &command);
        match command {
          Cmd::SaveDocument {
            file_type,
            filename,
            document,
            callback,
            error,
          } => {
            tauri::execute_promise(
              webview,
              move || match handler::save_document(file_type, filename, document) {
                Ok(_) => Ok(()),
                Err(e) => Err(e.into()),
              },
              callback,
              error,
            );
          }
          Cmd::LoadDocument {
            filename,
            callback,
            error,
          } => {
            tauri::execute_promise(
              webview,
              move || match handler::load_document(filename) {
                Ok(res) => Ok(res),
                Err(e) => Err(e.into()),
              },
              callback,
              error,
            );
          }
          Cmd::GetAvailableDocumentTypes { callback, error } => {
            tauri::execute_promise(
              webview,
              move || match handler::get_available_document_types() {
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
