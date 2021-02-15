#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

mod config;
mod load_save;
mod logger;
mod search;
mod types;

use logger::Logger;

fn main() {
  #[cfg(debug_assertions)]
  let logger = Logger::new(true);
  #[cfg(not(debug_assertions))]
  // TODO: set log_level to Info
  let logger = Logger::new(false);

  let config = config::Config;
  let load_save = load_save::LoadSave::new();
  let search = search::Gestis::new();

  tauri::AppBuilder::new()
    .plugin(config)
    .plugin(load_save)
    .plugin(logger)
    .plugin(search)
    .build()
    .run();
}
