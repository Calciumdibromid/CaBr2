use tauri::async_runtime;

pub fn main() {
  // must be initialized first
  let logger = cabr2_logger::plugin::Logger::new();

  let config = cabr2_config::plugin::Config::default();
  let search = async_runtime::block_on(cabr2_search::plugin::Search::new());

  let provider_mapping = async_runtime::block_on(cabr2_search::plugin::get_provider_mapping());
  let load_save = async_runtime::block_on(cabr2_load_save::plugin::LoadSave::new(provider_mapping));

  log::debug!("initializing tauri application...");

  tauri::Builder::default()
    .plugin(logger)
    .plugin(config)
    .plugin(search)
    .plugin(load_save)
    .setup(|_| {
      log::debug!("tauri setup complete");
      Ok(())
    })
    .run(tauri::generate_context!())
    .unwrap();
}
