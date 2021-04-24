#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

fn main() {
  // must be initialized first
  let logger = cabr2_logger::Logger::new();

  let config = cabr2_config::Config;
  let search = cabr2_search::Search::new();
  let load_save = cabr2_load_save::LoadSave::new(search.get_provider_mapping());

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
