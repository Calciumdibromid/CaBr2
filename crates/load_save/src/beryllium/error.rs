use serde::{ser::SerializeStruct, Serialize, Serializer};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum BerylliumError {
  #[error(transparent)]
  DeserializeError(#[from] quick_xml::DeError),
}

impl Serialize for BerylliumError {
  fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    match self {
      BerylliumError::DeserializeError(err) => serialize_string(serializer, "deserializeError", err),
    }
  }
}

fn serialize_string<S: Serializer, ST: ToString>(
  ser: S,
  name: &'static str,
  field_value: ST,
) -> std::result::Result<S::Ok, S::Error> {
  let mut st = ser.serialize_struct("Error", 1)?;
  st.serialize_field(name, &field_value.to_string())?;
  st.end()
}
