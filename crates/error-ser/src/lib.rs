use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct SerializableError {
  #[serde(rename = "type")]
  type_: &'static str,
  #[serde(skip_serializing_if = "Option::is_none")]
  message: Option<String>,
}

impl SerializableError {
  pub fn new(name: &'static str) -> SerializableError {
    SerializableError {
      type_: name,
      message: None,
    }
  }

  pub fn with_message<T: ToString>(name: &'static str, message: T) -> SerializableError {
    SerializableError {
      type_: name,
      message: Some(message.to_string()),
    }
  }
}
