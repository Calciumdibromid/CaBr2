mod cmd;

use std::fs;

use fern::Dispatch;
use log::LevelFilter;
use serde_json::{to_string_pretty, Value};
use tauri::plugin::Plugin;

use cmd::{Cmd, LogLevel};

pub struct Logger {}

impl Logger {
  pub fn new(debug: bool) -> Self {
    Logger::setup_logger(debug).unwrap();
    Logger {}
  }

  fn setup_logger(debug: bool) -> Result<(), fern::InitError> {
    let log_file = format!(
      // TODO cross platform solution
      "/tmp/cabr2_{}.log",
      chrono::Local::now().format("%F_%H.%M.%S")
    );
    println!("log file: {}", log_file);
    Dispatch::new()
      .format(|out, message, record| {
        out.finish(format_args!(
          "{}[{}][{}] {}",
          chrono::Local::now().format("[%+]"),
          record.target(),
          record.level(),
          message
        ))
      })
      .level({
        if debug {
          LevelFilter::Trace
        } else {
          LevelFilter::Debug
        }
      })
      .level_for("ureq", LevelFilter::Warn)
      .level_for("rustls", LevelFilter::Warn)
      .chain(std::io::stdout())
      .chain(fs::OpenOptions::new().create(true).write(true).open(&log_file)?)
      .apply()?;
    log::info!("log file: {}", log_file);
    Ok(())
  }

  fn handle(&self, level: LogLevel, message: Option<Value>) -> Result<(), String> {
    match to_string_pretty(&message) {
      Ok(message) => {
        match level {
          LogLevel::TRACE => log::trace!("{}", message),
          LogLevel::DEBUG => log::debug!("{}", message),
          LogLevel::INFO => log::info!("{}", message),
          LogLevel::WARNING => log::warn!("{}", message),
          LogLevel::ERROR => log::error!("{}", message),
        }
        Ok(())
      }
      Err(e) => Err(e.to_string()),
    }
  }
}

impl Plugin for Logger {
  fn extend_api(&self, _: &mut tauri::Webview, payload: &str) -> Result<bool, String> {
    match serde_json::from_str(payload) {
      Err(e) => Err(e.to_string()),
      Ok(command) => {
        match command {
          Cmd::Log { level, message } => self.handle(level, message)?,
        }
        Ok(true)
      }
    }
  }
}
