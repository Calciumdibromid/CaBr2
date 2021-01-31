#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod frontend_logger;
mod parsers;
mod search;

use frontend_logger::Logger;

fn main() {
  #[cfg(debug_assertions)]
  let logger = Logger::new(true);
  #[cfg(not(debug_assertions))]
  // TODO: set log_level to Info
  let logger = Logger::new(false);

  let gestis_search = search::Gestis::new();
  let gestis_parser = parsers::Gestis::new();

  tauri::AppBuilder::new()
    .plugin(logger)
    .plugin(gestis_search)
    .plugin(gestis_parser)
    .build()
    .run();
}
