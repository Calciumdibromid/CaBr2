#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod logger;
mod search;

use logger::Logger;

fn main() {
  #[cfg(debug_assertions)]
  let logger = Logger::new(true);
  #[cfg(not(debug_assertions))]
  // TODO: set log_level to Info
  let logger = Logger::new(false);

  let gestis = search::Gestis::new();

  tauri::AppBuilder::new()
    .plugin(logger)
    .plugin(gestis)
    .build()
    .run();
}
