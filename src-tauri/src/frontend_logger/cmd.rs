use serde::Deserialize;
use serde_json::Value;

#[derive(Deserialize)]
pub enum LogLevel {
  TRACE,
  DEBUG,
  INFO,
  WARNING,
  ERROR,
}

#[derive(Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
  Log {
    level: LogLevel,
    message: Option<Value>,
  },
}
