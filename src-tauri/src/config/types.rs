use std::collections::HashMap;

use serde::{Deserialize, Serialize};

/* #region JSON types */

#[derive(Debug, Deserialize, Serialize)]
pub struct JsonConfig {
  pub global: JsonGlobal,
}

impl std::convert::From<TomlConfig> for JsonConfig {
  fn from(config: TomlConfig) -> Self {
    JsonConfig {
      global: config.global.into(),
    }
  }
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct JsonGlobal {
  pub dark_theme: bool,
}

impl std::convert::From<TomlGlobal> for JsonGlobal {
  fn from(config: TomlGlobal) -> Self {
    JsonGlobal {
      dark_theme: config.dark_theme,
    }
  }
}

/* #endregion */

/* #region Toml types */

#[derive(Debug, Deserialize, Serialize)]
pub struct TomlConfig {
  pub global: TomlGlobal,
}

impl std::convert::From<JsonConfig> for TomlConfig {
  fn from(config: JsonConfig) -> Self {
    TomlConfig {
      global: config.global.into(),
    }
  }
}

impl std::default::Default for TomlConfig {
  fn default() -> Self {
    TomlConfig {
      global: TomlGlobal { dark_theme: false },
    }
  }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct TomlGlobal {
  pub dark_theme: bool,
}

impl std::convert::From<JsonGlobal> for TomlGlobal {
  fn from(config: JsonGlobal) -> Self {
    TomlGlobal {
      dark_theme: config.dark_theme,
    }
  }
}

/* #endregion */

/* #region other types */

pub type GHSSymbols = HashMap<String, String>;

/* #endregion */
