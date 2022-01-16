#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

mod impls;

use tauri::async_runtime;

use impls::{config, load_save, logger, search};

pub fn main() {
  // must be initialized first
  let logger = logger::Logger::new();

  let config = config::Config::default();
  let search = async_runtime::block_on(search::Search::new());

  let provider_mapping = async_runtime::block_on(search::get_provider_mapping());
  let load_save = async_runtime::block_on(load_save::LoadSave::new(provider_mapping));

  log::debug!("initializing tauri application...");

  tauri::Builder::default()
    .plugin(logger)
    .plugin(config)
    .plugin(search)
    .plugin(load_save)
    .setup(|_| {
      log::debug!("tauri setup complete");
      Ok(())
    })
    .run(tauri::generate_context!())
    .unwrap();
}
