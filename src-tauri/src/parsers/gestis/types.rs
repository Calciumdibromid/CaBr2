use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct GestisResponse {
  #[serde(rename = "zvgnummer_mit_null")]
  pub zvg_number: String,
  pub name: String,
  #[serde(rename = "hauptkapitel")]
  pub chapters: Vec<Chapter>,
}

#[derive(Debug, Deserialize)]
pub struct Chapter {
  #[serde(rename = "drnr")]
  pub dr_number: String,
  #[serde(rename = "unterkapitel")]
  pub subchapters: Vec<Subchapter>,
}

#[derive(Debug, Deserialize)]
pub struct Subchapter {
  #[serde(rename = "drnr")]
  pub dr_number: String,
  pub text: Option<String>,
}
