use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Deserialize, Serialize)]
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
    path: String,
    messages: Vec<Value>,
  },
}
