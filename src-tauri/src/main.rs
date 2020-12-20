#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod frontend_logger;
mod search;

use frontend_logger::Logger;
use search::Gestis;

fn main() {
  #[cfg(debug_assertions)]
  let logger = Logger::new(true);
  #[cfg(not(debug_assertions))]
  // TODO: set log_level to Info
  let logger = Logger::new(false);

  let gestis = Gestis::new();

  tauri::AppBuilder::new()
    .plugin(logger)
    .plugin(gestis)
    .build()
    .run();
}
