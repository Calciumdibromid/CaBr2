use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SubstanceData {
  pub name: Data<String>,
  pub alternative_names: Data<Vec<String>>,
  pub cas: Data<Option<String>>,
  pub molecular_formula: Data<String>,
  pub molar_mass: Data<Option<String>>,
  pub melting_point: Data<Option<String>>,
  pub boiling_point: Data<Option<String>>,
  pub water_hazard_class: Data<Option<String>>,
  pub h_phrases: Data<Vec<(String, String)>>,
  pub p_phrases: Data<Vec<(String, String)>>,
  pub signal_word: Data<Option<String>>,
  pub symbols: Data<Vec<String>>,
  pub lethal_dose: Data<Option<String>>,
  pub mak: Data<Option<String>>,
  pub amount: Data<Option<Amount>>,
  pub source: Source,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Data<T> {
  #[serde(skip_serializing_if = "Option::is_none")]
  modified_data: Option<T>,
  original_data: T,
}

impl<T> Data<T> {
  pub fn new(data: T) -> Data<T> {
    Data {
      modified_data: None,
      original_data: data,
    }
  }
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename = "camelCase")]
pub struct Source {
  pub provider: String,
  pub url: String,
  pub last_updated: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Amount {
  pub amount: String,
  pub unit: Unit,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename = "camelCase")]
pub enum Unit {
  Litre,
  Milliliter,
  Microlitre,
  Gram,
  Milligram,
  Microgram,
  Pieces,
  Custom(String),
}
