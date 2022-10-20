#![allow(clippy::upper_case_acronyms)]

#[cfg(feature = "lock")]
pub mod lock;
pub mod logging;

use std::collections::HashMap;

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SubstanceData {
  pub name: Data<String>,
  pub cas: Data<String>,
  pub molecular_formula: Data<String>,
  pub molar_mass: Data<String>,
  pub melting_point: Data<String>,
  pub boiling_point: Data<String>,
  pub water_hazard_class: Data<String>,
  pub h_phrases: Data<Vec<(String, String)>>,
  pub p_phrases: Data<Vec<(String, String)>>,
  pub signal_word: Data<String>,
  pub symbols: Data<Vec<String>>,
  pub lethal_dose: Data<String>,
  pub mak: Data<String>,
  pub amount: Option<Amount>,
  pub source: Source,

  // set to true if user has clicked on this substance
  pub checked: bool,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Data<T> {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub modified_data: Option<T>,
  pub original_data: Vec<T>,
}

impl<T> Data<T> {
  pub fn new(data: Vec<T>) -> Data<T> {
    Data {
      modified_data: None,
      original_data: data,
    }
  }
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Source {
  pub provider: String,
  pub url: String,
  pub last_updated: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Amount {
  pub value: String,
  #[serde(flatten)]
  pub unit: Unit,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE", tag = "type", content = "name")]
pub enum Unit {
  Liter,
  Milliliter,
  Microliter,
  Gram,
  Milligram,
  Microgram,
  Mol,
  Millimol,
  Pieces,

  SolutionRelative,
  SolutionMol,
  SolutionMillimol,
  SolutionMicromol,
  SolutionGram,
  SolutionMilligram,

  Custom(String),

  GramPerMol,

  MilligramPerKilogram,
  MilligramPerLiter,

  PartsPerMillion,

  Celsius,
  Fahrenheit,
}

impl std::convert::From<Unit> for std::string::String {
  fn from(unit: Unit) -> Self {
    use Unit::*;
    match unit {
      Liter => "l".into(),
      Milliliter => "ml".into(),
      Microliter => "µl".into(),
      Gram => "g".into(),
      Milligram => "mg".into(),
      Microgram => "µg".into(),
      Mol => "mol".into(),
      Millimol => "mmol".into(),
      Pieces => "st".into(),

      SolutionRelative => "% (v/v)".into(),
      SolutionMol => "mol/l".into(),
      SolutionMillimol => "mmol/l".into(),
      SolutionMicromol => "µmol/l".into(),
      SolutionGram => "g/l".into(),
      SolutionMilligram => "mg/l".into(),

      GramPerMol => "g/mol".into(),

      MilligramPerKilogram => "mg/kg".into(),
      MilligramPerLiter => "mg/l".into(),

      PartsPerMillion => "ppm".into(),

      Custom(name) => name,

      Celsius => "°C".into(),
      Fahrenheit => "F".into(),
    }
  }
}

pub type ProviderMapping = HashMap<String, String>;
