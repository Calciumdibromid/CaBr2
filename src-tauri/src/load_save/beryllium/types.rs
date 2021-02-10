use serde::Deserialize;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub struct BerylliumDocument {
  pub general: General,
  pub personal: Personal,
  pub product: Product,
  pub templates: Templates,
  pub options: Options,
  // #[serde(rename = "substance")]
  // pub substances: Vec<Substance>,
}

#[derive(Debug, Deserialize)]
pub struct General {
  pub title: String,
  pub title_ghs: String,
  pub location: String,
  pub institute: String,
  #[serde(rename = "statementleft")]
  pub statement_left: String,
  #[serde(rename = "signaturleft")]
  pub signatur_left: String,
  #[serde(rename = "statementright")]
  pub statement_right: String,
  #[serde(rename = "signaturright")]
  pub signatur_right: String,
}

#[derive(Debug, Deserialize)]
pub struct Personal {
  pub name: String,
  pub firstname: Option<String>,
  pub spot: String,
  pub assistant: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub struct Product {
  pub name: String,
  pub chemical_formula: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum TemplateCategory {
  Danger,
  Security,
  Behavior,
  Dumping,
}

#[derive(Debug, Deserialize)]
pub struct Templates {
  #[serde(rename = "template")]
  templates: Vec<Template>,
}

#[derive(Debug, Deserialize)]
pub struct Template {
  pub category: TemplateCategory,
  #[serde(rename = "$value")]
  pub content: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub struct Options {
  pub ghs_mode: String,
  #[serde(rename = "showcolumn")]
  pub show_columns: Vec<String>,
  #[serde(rename = "hidephrase")]
  pub hide_phrases: Option<Vec<String>>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub struct Substance {
  // TODO
}
