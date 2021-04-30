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

use tauri::{plugin::Plugin, InvokeMessage, Params, Window};

use cabr2_types::ProviderMapping;

pub struct LoadSave<M: Params> {
  invoke_handler: Box<dyn Fn(InvokeMessage<M>) + Send + Sync>,
}

impl<M: Params> LoadSave<M> {
  pub fn new(provider_mapping: ProviderMapping) -> Self {
    let mut loaders = handler::REGISTERED_LOADERS.lock().unwrap();
    loaders.insert("cb2", ("CaBr2", Box::new(cabr2::CaBr2)));
    loaders.insert("be", ("Beryllium", Box::new(beryllium::Beryllium)));

    let mut savers = handler::REGISTERED_SAVERS.lock().unwrap();
    savers.insert("cb2", ("CaBr2", Box::new(cabr2::CaBr2)));
    savers.insert("pdf", ("PDF", Box::new(pdf::PDF::new(provider_mapping))));

    use cmd::*;
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
