#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

mod impls;

use tauri::{async_runtime, Manager, PhysicalSize};

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
    .setup(|app| {
      let main_window = app.get_window("main").unwrap();
      main_window.set_min_size(Some(PhysicalSize::new(300, 300))).unwrap();

      log::debug!("tauri setup complete");
      Ok(())
    })
    .run(tauri::generate_context!())
    .unwrap();
}
