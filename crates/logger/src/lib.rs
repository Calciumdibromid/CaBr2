#![allow(clippy::new_without_default)]

use std::fs;

use fern::Dispatch;
use log::LevelFilter;

use ::types::logging::LogLevel;
use config::{read_config, BackendConfig, TMP_DIR};

pub async fn setup_logger() -> Result<(), fern::InitError> {
  let mut log_file = TMP_DIR.clone();
  log_file.push("logs/");
  fs::create_dir_all(&log_file).unwrap();
  log_file.push(format!("cabr2_{}.log", chrono::Local::now().format("%F_%H.%M.%S")));

  let config = read_config().await;
  let config = config
    .unwrap_or_else(|e| {
      eprintln!("loading config failed: {}", e);
      eprintln!("continuing with default config");
      BackendConfig::default()
    })
    .logging;

  let cabr2_level = convert_level(config.cabr2);

  Dispatch::new()
    .format(|out, message, record| {
      out.finish(format_args!(
        "[{}][{}:{}][{}] {}",
        chrono::Local::now().format("%+"),
        record.target(),
        record.line().unwrap_or(0),
        record.level(),
        message
      ))
    })
    .level(convert_level(config.all))
    .level_for("cabr2", cabr2_level)
    .level_for("cabr2_wasm_lib", cabr2_level)
    .level_for("webserver", cabr2_level)
    .level_for("config", cabr2_level)
    .level_for("load_save", cabr2_level)
    .level_for("logger", cabr2_level)
    .level_for("search", cabr2_level)
    .level_for("types", cabr2_level)
    .level_for("reqwest", convert_level(config.reqwest))
    .chain(std::io::stdout())
    .chain(fs::OpenOptions::new().create(true).write(true).open(&log_file)?)
    .apply()?;
  log::info!("log file: {:?}", log_file);
  Ok(())
}

/// Converts an `Option<LogLevel>` into `LevelFilter`.
/// If the Option is `None` the filter is set to `Error`.
fn convert_level(level: Option<LogLevel>) -> LevelFilter {
  match level {
    Some(level) => level.into(),
    None => LevelFilter::Error,
  }
}
