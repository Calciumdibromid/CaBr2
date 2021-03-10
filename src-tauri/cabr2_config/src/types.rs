use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use serde_json::Value;

use cabr2_types::logging::LogLevel;

/* #region JSON types */

#[derive(Debug, Deserialize, Serialize)]
pub struct JsonConfig {
  pub global: JsonGlobal,
  pub logging: JsonLogging,
}

impl std::convert::From<TomlConfig> for JsonConfig {
  fn from(config: TomlConfig) -> Self {
    JsonConfig {
      global: config.global.into(),
      logging: config.logging.into(),
    }
  }
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct JsonGlobal {
  pub dark_theme: bool,
  pub language: String,
}

impl std::convert::From<TomlGlobal> for JsonGlobal {
  fn from(config: TomlGlobal) -> Self {
    JsonGlobal {
      dark_theme: config.dark_theme,
      language: config.language,
    }
  }
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct JsonLogging {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub all: Option<LogLevel>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub cabr2: Option<LogLevel>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub rustls: Option<LogLevel>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub ureq: Option<LogLevel>,
}

impl std::convert::From<TomlLogging> for JsonLogging {
  fn from(config: TomlLogging) -> Self {
    JsonLogging {
      all: config.all,
      cabr2: config.cabr2,
      rustls: config.rustls,
      ureq: config.ureq,
    }
  }
}

/* #endregion */

/* #region Toml types */

#[derive(Debug, Deserialize, Serialize)]
pub struct TomlConfig {
  pub global: TomlGlobal,
  pub logging: TomlLogging,
}

impl std::convert::From<JsonConfig> for TomlConfig {
  fn from(config: JsonConfig) -> Self {
    TomlConfig {
      global: config.global.into(),
      logging: config.logging.into(),
    }
  }
}

impl std::default::Default for TomlConfig {
  fn default() -> Self {
    TomlConfig {
      global: TomlGlobal {
        dark_theme: false,
        language: "en_us".into(),
      },
      logging: TomlLogging {
        all: Some(LogLevel::DEBUG),
        cabr2: Some(LogLevel::DEBUG),
        rustls: None,
        ureq: None,
      },
    }
  }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct TomlGlobal {
  pub dark_theme: bool,
  pub language: String,
}

impl std::convert::From<JsonGlobal> for TomlGlobal {
  fn from(config: JsonGlobal) -> Self {
    TomlGlobal {
      dark_theme: config.dark_theme,
      language: config.language,
    }
  }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct TomlLogging {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub all: Option<LogLevel>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub cabr2: Option<LogLevel>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub rustls: Option<LogLevel>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub ureq: Option<LogLevel>,
}

impl std::convert::From<JsonLogging> for TomlLogging {
  fn from(config: JsonLogging) -> Self {
    TomlLogging {
      all: config.all,
      cabr2: config.cabr2,
      rustls: config.rustls,
      ureq: config.ureq,
    }
  }
}

/* #endregion */

/* #region other types */

pub type GHSSymbols = HashMap<String, String>;

#[derive(Debug, Deserialize, Serialize)]
pub struct LocalizedStringsHeader {
  version: u8,
  name: String,
  locale: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct LocalizedStrings {
  pub strings: Value,
}

/* #endregion */
