#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

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

  let gestis = search::Gestis::new();
  let load_save = load_save::LoadSave::new();

  tauri::AppBuilder::new()
    .plugin(logger)
    .plugin(gestis)
    .plugin(load_save)
    .build()
    .run();
}
