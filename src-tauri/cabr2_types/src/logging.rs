use log::LevelFilter;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum LogLevel {
  TRACE,
  DEBUG,
  INFO,
  WARNING,
  ERROR,
}

impl std::convert::From<LogLevel> for LevelFilter {
  fn from(level: LogLevel) -> Self {
    match level {
      LogLevel::TRACE => LevelFilter::Trace,
      LogLevel::DEBUG => LevelFilter::Debug,
      LogLevel::INFO => LevelFilter::Info,
      LogLevel::WARNING => LevelFilter::Warn,
      LogLevel::ERROR => LevelFilter::Error,
    }
  }
}
