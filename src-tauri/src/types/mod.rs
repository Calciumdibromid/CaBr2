use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SubstanceData {
  pub molecular_formula: Data<String>,
  pub melting_point: Data<Option<String>>,
  pub boiling_point: Data<Option<String>>,
  pub water_hazard_class: Data<Option<String>>,
  pub h_phrases: Data<Vec<(String, String)>>,
  pub p_phrases: Data<Vec<(String, String)>>,
  pub signal_word: Data<Option<String>>,
  pub symbols: Data<Vec<Image>>,
  pub lethal_dose: Data<Option<String>>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Data<T> {
  data: T,
  modified: bool,
}

impl<T> Data<T> {
  pub fn new(data: T) -> Data<T> {
    Data {
      data,
      modified: false,
    }
  }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Image {
  pub src: String,
  pub alt: String,
}
