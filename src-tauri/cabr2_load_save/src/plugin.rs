use std::path::PathBuf;

use tauri::{plugin::Plugin, InvokeMessage, Params, Window};

use cabr2_types::ProviderMapping;

use crate::{
  error::Result,
  handler::{self, init_handlers},
  types::{CaBr2Document, DocumentTypes},
};

#[tauri::command]
pub fn save_document(file_type: String, filename: PathBuf, document: CaBr2Document) -> Result<()> {
  handler::save_document(file_type, filename, document)
}

#[tauri::command]
pub fn load_document(filename: PathBuf) -> Result<CaBr2Document> {
  handler::load_document(filename)
}

#[tauri::command]
pub fn get_available_document_types() -> Result<DocumentTypes> {
  handler::get_available_document_types()
}

pub struct LoadSave<M: Params> {
  invoke_handler: Box<dyn Fn(InvokeMessage<M>) + Send + Sync>,
}

impl<M: Params> LoadSave<M> {
  pub fn new(_provider_mapping: ProviderMapping) -> Self {
    init_handlers(_provider_mapping);
    LoadSave {
      invoke_handler: Box::new(tauri::generate_handler![
        save_document,
        load_document,
        get_available_document_types,
      ]),
    }
  }
}

impl<M: Params> Plugin<M> for LoadSave<M> {
  fn name(&self) -> &'static str {
    "cabr2_load_save"
  }

  fn extend_api(&mut self, message: InvokeMessage<M>) {
    (self.invoke_handler)(message)
  }

  fn created(&mut self, _: Window<M>) {
    log::trace!("plugin created");
  }
}
