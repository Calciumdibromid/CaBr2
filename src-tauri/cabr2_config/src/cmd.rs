use serde::Deserialize;

use super::types::JsonConfig;

#[derive(Debug, Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
  GetProgramVersion {
    callback: String,
    error: String,
  },
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
  GetAvailableLanguages {
    callback: String,
    error: String,
  },
  GetLocalizedStrings {
    language: String,
    callback: String,
    error: String,
  },
  GetPromptHtml {
    name: String,
    callback: String,
    error: String,
  },
}
