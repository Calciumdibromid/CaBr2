mod types;

use async_trait::async_trait;
use chrono::TimeZone;
use lazy_static::lazy_static;
use quick_xml::de::from_reader;
use regex::Regex;

use cabr2_types::{Amount, Data, Source, SubstanceData, Unit};

use super::{
  error::{LoadSaveError, Result},
  types::{CaBr2Document, Header, Loader},
};
use types::{BerylliumDocument, TemplateCategory};

pub struct Beryllium;

#[cfg_attr(not(feature = "wasm"), async_trait)]
#[cfg_attr(feature = "wasm", async_trait(?Send))]
impl Loader for Beryllium {
  async fn load_document(&self, contents: Vec<u8>) -> Result<CaBr2Document> {
    lazy_static! {
      static ref BEGINNING_OF_TIME: chrono::DateTime<chrono::Utc> = chrono::Utc.ymd(1970, 1, 1).and_hms(0, 0, 0);
      static ref GESTIS_URL_RE: Regex =
        Regex::new(r"http://gestis\.itrust\.de/nxt/gateway\.dll/gestis_(de|en)/(\d{6})\.xml").unwrap();
    }

    match from_reader(contents.as_slice()) {
      Ok(beryllium_doc) => {
        // simplest way for a typedefinition
        let beryllium_doc: BerylliumDocument = beryllium_doc;
        Ok(CaBr2Document {
          disposal: get_templates_with_category(&beryllium_doc, TemplateCategory::Dumping),
          human_and_environment_danger: get_templates_with_category(&beryllium_doc, TemplateCategory::Danger),
          in_case_of_danger: get_templates_with_category(&beryllium_doc, TemplateCategory::Behavior),
          rules_of_conduct: get_templates_with_category(&beryllium_doc, TemplateCategory::Security),
          header: Header {
            assistant: beryllium_doc.personal.assistant,
            document_title: beryllium_doc.general.title,
            lab_course: beryllium_doc.general.location,
            name: beryllium_doc.personal.name,
            organisation: beryllium_doc.general.institute,
            place: beryllium_doc.personal.spot,
            preparation: beryllium_doc.product.name,
          },
          substance_data: beryllium_doc
            .substances
            .into_iter()
            .map(|mut substance| SubstanceData {
              name: Data::new(substance.names[0].clone()),
              alternative_names: substance.names.split_off(1),
              cas: Data::new(substance.cas),
              molecular_formula: Data::new(substance.chemical_formula),
              molar_mass: Data::new(substance.molecular_weight),
              boiling_point: Data::new(substance.boiling_point),
              melting_point: Data::new(match substance.melting_point {
                Some(mp) => Some(mp.value),
                None => None,
              }),
              water_hazard_class: Data::new(substance.wgk),
              h_phrases: Data::new(match substance.harzard_statements {
                Some(phrases) => phrases
                  .split('-')
                  .map(|p| (format!("H{}", p), "".into())) // TODO fill statements
                  .collect(),
                None => Vec::new(),
              }),
              p_phrases: Data::new(match substance.precautionary_statements {
                Some(phrases) => phrases
                  .split('-')
                  .map(|p| (format!("P{}", p), "".into())) // TODO fill statements
                  .collect(),
                None => Vec::new(),
              }),
              signal_word: Data::new(substance.signal_word),
              symbols: Data::new(match substance.symbols {
                Some(symbols) => symbols
                  .into_iter()
                  .map(|s| format!("ghs{}", s.trim_end_matches("-neu")))
                  .collect(),
                None => Vec::new(),
              }),
              lethal_dose: Data::new(match substance.lethaldose50 {
                Some(ld50) => Some(ld50.value),
                None => None,
              }),
              mak: Data::new(match substance.mak {
                Some(mak) => Some(mak.value),
                None => None,
              }),
              amount: {
                let mut unit = None;
                let mut value = None;
                if let Some(su) = substance.setting_up {
                  if su.volumina.unwrap_or_default() {
                    unit = Some(Unit::Liter);
                  } else if su.mass.unwrap_or_default() {
                    unit = Some(Unit::Gram);
                  }
                  value = Some(su.value);
                }
                if let Some(c) = substance.concentration {
                  if c.relative.unwrap_or_default() {
                    unit = Some(Unit::SolutionRelative);
                  } else {
                    unit = Some(Unit::SolutionMol);
                  }
                  value = substance.solution_volumina;
                }

                if unit.is_some() && value.is_some() {
                  Some(Amount {
                    unit: unit.unwrap(),
                    value: value.unwrap(),
                  })
                } else {
                  log::debug!("could not convert amount: {{ unit: {:?}, value: {:?} }}", unit, value);
                  None
                }
              },
              source: Source {
                provider: substance
                  .source_provider
                  .unwrap_or_else(|| "custom".into())
                  .to_lowercase(),
                url: {
                  let mut url = substance.source_url.unwrap_or_default();
                  // remap gestis url to new one
                  if GESTIS_URL_RE.is_match(&url) {
                    let captures = GESTIS_URL_RE.captures(&url).unwrap();
                    url = format!(
                      "https://gestis-api.dguv.de/api/article/{}/{}",
                      &captures[1], &captures[2]
                    );
                  }
                  url
                },
                last_updated: match chrono::DateTime::parse_from_rfc2822(&substance.source_fetched.unwrap_or_default())
                {
                  Ok(datetime) => datetime.into(),
                  Err(_) => *BEGINNING_OF_TIME,
                },
              },

              checked: true,
            })
            .collect(),
        })
      }
      Err(e) => Err(LoadSaveError::DeserializeError(e.to_string())),
    }
  }
}

fn get_templates_with_category(doc: &BerylliumDocument, category: TemplateCategory) -> Vec<String> {
  doc
    .templates
    .templates
    .iter()
    .filter(|t| t.category == category)
    .map(|t| t.content.clone())
    .collect()
}
