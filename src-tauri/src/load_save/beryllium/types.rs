use serde::Deserialize;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub struct BerylliumDocument {
  pub general: General,
  pub personal: Personal,
  pub product: Product,
  pub templates: Templates,
  pub options: Options,
  #[serde(rename = "substance")]
  pub substances: Vec<Substance>,
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
pub struct Templates {
  #[serde(rename = "template")]
  templates: Vec<Template>,
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
  #[serde(rename = "name")]
  pub names: Vec<String>,
  pub molecular_weight: Option<String>, // double
  pub chemical_formula: String,
  pub density: Option<String>, // double
  pub melting_point: Option<MeltingPoint>,
  pub boiling_point: Option<String>,
  pub flashpoint: Option<String>,
  #[serde(rename = "hazard")]
  pub harzards: Option<Vec<String>>,
  #[serde(rename = "GHS-symbol")]
  pub symbols: Option<Vec<String>>,
  #[serde(rename = "GHS-signalword")]
  pub signal_word: Option<String>,
  pub risk: Option<String>,
  pub safety: Option<String>,
  pub harzard_statements: Option<String>,
  pub eu_harzard_statements: Option<String>,
  pub precautionary_statements: Option<String>,
  #[serde(rename = "MAK")]
  pub mak: Option<MAK>, // double
  #[serde(rename = "WGK")]
  pub wgk: Option<String>, // unsigned int
  pub lethaldose50: Option<LD50>,
  #[serde(rename = "CAS")]
  pub cas: Option<String>,
  pub group: Option<String>,
  pub setting_up: Option<SettingUp>,
  pub concentration: Option<Concentration>,
  pub solution_volumina: Option<String>, // double
  pub template: Option<Templates>,
  #[serde(rename = "source.provider")]
  pub source_provider: Option<String>,
  #[serde(rename = "source.fetched")]
  pub source_fetched: Option<String>,
  #[serde(rename = "source.url")]
  pub source_url: Option<String>,
  #[serde(rename = "source.changed")]
  pub source_changed: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct MeltingPoint {
  pub decomposition: Option<bool>,
  #[serde(rename = "$value")]
  pub value: String,
}

#[derive(Debug, Deserialize)]
pub struct MAK {
  pub ppm: Option<bool>,
  #[serde(rename = "$value")]
  pub value: String,
}

#[derive(Debug, Deserialize)]
pub struct LD50 {
  pub exposuretype: Option<String>,
  pub species: Option<String>,
  pub unit: Option<String>,
  #[serde(rename = "$value")]
  pub value: String, // double
}

#[derive(Debug, Deserialize)]
pub struct SettingUp {
  pub volumina: Option<bool>,
  pub mass: Option<bool>,
  #[serde(rename = "$value")]
  pub value: String, // double
}

#[derive(Debug, Deserialize)]
pub struct Concentration {
  pub relative: Option<bool>,
  #[serde(rename = "$value")]
  pub value: String, // double
}
