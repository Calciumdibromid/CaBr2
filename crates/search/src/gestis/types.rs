use serde::{Deserialize, Serialize};

#[derive(Debug, PartialEq)]
pub struct ParsedData {
  pub cas: Vec<String>,
  pub molecular_formula: Vec<String>,
  pub molar_mass: Vec<String>,
  pub melting_point: Vec<String>,
  pub boiling_point: Vec<String>,
  pub water_hazard_class: Vec<String>,
  pub h_phrases: Vec<Vec<(String, String)>>,
  pub p_phrases: Vec<Vec<(String, String)>>,
  pub signal_word: Vec<String>,
  pub symbols: Vec<Vec<String>>,
  pub lethal_dose: Vec<String>,
  pub mak: Vec<String>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct GestisResponse {
  #[serde(rename = "zvgnummer_mit_null")]
  pub zvg_number: String,
  pub name: String,
  #[serde(rename = "hauptkapitel")]
  pub chapters: Vec<Chapter>,
  pub aliases: Vec<Alias>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Chapter {
  #[serde(rename = "drnr")]
  pub number: String,
  #[serde(rename = "unterkapitel")]
  pub subchapters: Vec<Subchapter>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Subchapter {
  #[serde(rename = "drnr")]
  pub number: String,
  pub text: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Alias {
  pub name: String,
}

#[derive(Debug)]
pub struct ChapterMapping<'a> {
  pub boiling_point: Option<&'a str>,
  pub cas_number: Option<&'a str>,
  pub h_p_signal_symbols: Option<&'a str>,
  pub lethal_dose: Option<&'a str>,
  /// new version -> sources: MAK, TRGS 900
  pub agw: Option<&'a str>,
  /// older version see [Self::agw]
  pub mak: Option<&'a str>,
  pub melting_point: Option<&'a str>,
  pub molecular_formula_molar_mass: Option<&'a str>,
  pub water_hazard_class: Option<&'a str>,
}
