use serde::Deserialize;
use serde_json::Value;

use cabr2_types::logging::LogLevel;

#[derive(Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
  Log {
    level: LogLevel,
    path: String,
    messages: Vec<Value>,
  },
}
