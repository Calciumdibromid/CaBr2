#![allow(clippy::new_without_default)]
#![allow(clippy::unnecessary_unwrap)]
#![allow(clippy::upper_case_acronyms)]

mod cmd;
mod error;
mod handler;
mod types;

#[cfg(feature = "beryllium")]
mod beryllium;
#[cfg(feature = "cabr2")]
mod cabr2;
#[cfg(feature = "pdf")]
mod pdf;

use tauri::{plugin::Plugin, InvokeMessage, Params, Window};

use cabr2_types::ProviderMapping;

pub struct LoadSave<M: Params> {
  invoke_handler: Box<dyn Fn(InvokeMessage<M>) + Send + Sync>,
}

impl<M: Params> LoadSave<M> {
  pub fn new(_provider_mapping: ProviderMapping) -> Self {
    let mut _loaders = handler::REGISTERED_LOADERS.lock().unwrap();
    #[cfg(feature = "cabr2")]
    _loaders.insert("cb2", ("CaBr2", Box::new(cabr2::CaBr2)));
    #[cfg(feature = "beryllium")]
    _loaders.insert("be", ("Beryllium", Box::new(beryllium::Beryllium)));

    let mut _savers = handler::REGISTERED_SAVERS.lock().unwrap();
    #[cfg(feature = "cabr2")]
    _savers.insert("cb2", ("CaBr2", Box::new(cabr2::CaBr2)));
    #[cfg(feature = "pdf")]
    _savers.insert("pdf", ("PDF", Box::new(pdf::PDF::new(_provider_mapping))));

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
