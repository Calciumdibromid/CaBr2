use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use serde_json::Value;

use cabr2_types::logging::LogLevel;

use crate::handler;

/* #region JSON types */

#[derive(Debug, Deserialize, Serialize)]
pub struct FrontendConfig {
  pub global: FrontendGlobal,
}

impl std::convert::From<BackendConfig> for FrontendConfig {
  fn from(config: BackendConfig) -> Self {
    FrontendConfig {
      global: config.global.into(),
    }
  }
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FrontendGlobal {
  pub dark_theme: bool,
  pub language: String,
  pub accepted_consent: bool,
}

impl std::convert::From<Global> for FrontendGlobal {
  fn from(config: Global) -> Self {
    FrontendGlobal {
      dark_theme: config.dark_theme,
      language: config.language,
      accepted_consent: config.accepted_consent,
    }
  }
}

/* #endregion */

/* #region Toml types */

#[derive(Debug, Deserialize, Serialize)]
pub struct BackendConfig {
  pub global: Global,
  pub logging: Logging,
}

impl std::convert::From<FrontendConfig> for BackendConfig {
  fn from(config: FrontendConfig) -> Self {
    let old_config = handler::read_config().unwrap();
    BackendConfig {
      global: config.global.into(),
      logging: old_config.logging,
    }
  }
}

impl std::default::Default for BackendConfig {
  fn default() -> Self {
    BackendConfig {
      global: Global {
        dark_theme: false,
        language: "de_de".into(),
        accepted_consent: false,
      },
      logging: Logging {
        all: Some(LogLevel::DEBUG),
        cabr2: Some(LogLevel::DEBUG),
        rustls: None,
        ureq: None,
      },
    }
  }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Global {
  pub dark_theme: bool,
  pub language: String,
  pub accepted_consent: bool,
}

impl std::convert::From<FrontendGlobal> for Global {
  fn from(config: FrontendGlobal) -> Self {
    Global {
      dark_theme: config.dark_theme,
      language: config.language,
      accepted_consent: config.accepted_consent,
    }
  }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Logging {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub all: Option<LogLevel>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub cabr2: Option<LogLevel>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub rustls: Option<LogLevel>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub ureq: Option<LogLevel>,
}

/* #endregion */

/* #region other types */

pub type GHSSymbols = HashMap<String, String>;

// the next two structs work with the same file, but parse different parts of it
#[derive(Debug, Deserialize, Serialize)]
pub struct LocalizedStringsHeader {
  name: String,
  locale: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct LocalizedStrings {
  pub strings: Value,
}

/* #endregion */
