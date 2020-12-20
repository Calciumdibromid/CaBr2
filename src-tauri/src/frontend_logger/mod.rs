mod cmd;

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
          LevelFilter::Debug
        } else {
          LevelFilter::Info
        }
      })
      .level_for("ureq", LevelFilter::Warn)
      .level_for("rustls", LevelFilter::Warn)
      .chain(std::io::stdout())
      .chain(fern::log_file("cabr2.log")?)
      .apply()?;
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
