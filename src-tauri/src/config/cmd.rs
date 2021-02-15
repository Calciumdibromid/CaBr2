use serde::Deserialize;

use super::types::JsonConfig;

#[derive(Debug, Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
  GetConfig {
    callback: String,
    error: String,
  },
  SaveConfig {
    config: JsonConfig,
    callback: String,
    error: String,
  },
  GetHazardSymbols {
    callback: String,
    error: String,
  },
}
