use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Data {
  pub molecular_formula: String,
  pub melting_point: Option<String>,
  pub boiling_point: Option<String>,
  pub water_hazard_class: Option<String>,
  pub h_phrases: Option<Vec<(String, String)>>,
  pub p_phrases: Option<Vec<(String, String)>>,
  pub signal_word: Option<String>,
  pub symbols: Option<Vec<Image>>,
  pub lethal_dose: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Image {
  pub url: String,
  pub alt: String,
}

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
