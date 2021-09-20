use serde::{Serialize, Serializer};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ConfigError {
  #[error("reading localization file for language '{0}' failed")]
  LocalizationReadError(String),
  #[error("no localization for language '{0}' found")]
  LocalizationNotFound(String),

  #[error("prompt html not found: {0}")]
  NoPromptHtml(String),

  #[error("toml deserializing failed: '{0}'")]
  TomlDeserializeError(#[from] toml::de::Error),
  #[error("toml serializing failed: '{0}'")]
  TomlSerializeError(#[from] toml::ser::Error),

  #[error("io error: '{0}'")]
  IOError(#[from] std::io::Error),
}

impl Serialize for ConfigError {
  fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    serializer.serialize_str(self.to_string().as_str())
  }
}

pub type Result<T> = std::result::Result<T, ConfigError>;
