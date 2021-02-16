use tauri::plugin::Plugin;

mod cmd;
mod error;
mod handler;
mod types;

mod beryllium;
mod cabr2;
mod pdf;

use cmd::Cmd;

pub struct LoadSave;

impl LoadSave {
  pub fn new() -> LoadSave {
    let mut loaders = handler::REGISTERED_LOADERS.lock().unwrap();
    loaders.insert("cb2", Box::new(cabr2::CaBr2));
    loaders.insert("be", Box::new(beryllium::Beryllium));

    let mut savers = handler::REGISTERED_SAVERS.lock().unwrap();
    savers.insert("cb2", Box::new(cabr2::CaBr2));
    savers.insert("pdf", Box::new(pdf::PDF));

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
          Cmd::GetAvailableDocumentTypes {
            callback,
            error,
          } => {
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
}
