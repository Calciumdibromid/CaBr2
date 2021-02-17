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

  tauri::AppBuilder::new()
    .plugin(config)
    .plugin(load_save)
    .plugin(logger)
    .plugin(search)
    .build()
    .run();
}
