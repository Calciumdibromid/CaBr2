#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

fn main() {
  // must be initialized first
  let logger = cabr2_logger::Logger::new();

  let config = cabr2_config::Config;
  let load_save = cabr2_load_save::LoadSave::new();
  let search = cabr2_search::Search::new();

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
