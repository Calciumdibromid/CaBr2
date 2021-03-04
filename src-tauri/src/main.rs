#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

mod config;
mod load_save;
mod logger;
mod search;
mod types;

fn main() {
  let logger = logger::Logger::new();
  let config = config::Config;
  let load_save = load_save::LoadSave::new();
  let search = search::Gestis::new();

  log::debug!("initializing tauri application...");

  tauri::AppBuilder::new()
    .plugin(config)
    .plugin(load_save)
    .plugin(logger)
    .plugin(search)
    .setup(|_, s| log::debug!("tauri setup complete ({})", s))
    .build()
    .run();
}
