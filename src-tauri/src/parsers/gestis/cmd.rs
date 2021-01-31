use serde::Deserialize;

#[derive(Debug, Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
  #[serde(rename_all = "camelCase")]
  GetChemicalInfo {
    zvg_number: String,
    callback: String,
    error: String,
  },
}
