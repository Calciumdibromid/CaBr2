mod error;
pub mod functions;
pub mod types;
pub mod xml_parser;

#[cfg(test)]
mod tests;

use async_trait::async_trait;
use reqwest::Client;
use serde::de::DeserializeOwned;

use ::types::{Data, Source, SubstanceData};

use self::{error::Result, types::GestisResponse};
use crate::{
  error::Result as SearchResult,
  types::{Provider, SearchArguments, SearchResponse, SearchType},
};

pub use self::error::GestisError;

const NAME: &str = "GESTIS-Stoffdatenbank";
const IDENTIFIER: &str = "gestis";
const BASE_URL: &str = "https://gestis-api.dguv.de/api";
const SEARCH_SUGGESTIONS: &str = "search_suggestions";
const SEARCH: &str = "search";
const ARTICLE: &str = "article";

// TODO: add runtime for async requests
pub struct Gestis {
  client: Client,
}

impl Gestis {
  pub fn new(client: Client) -> Gestis {
    Gestis { client }
  }

  async fn get_article(&self, identifier: String) -> Result<(GestisResponse, String)> {
    // create gestis url and left fill the identifier with zeros if it's smaller than 6
    let url = format!("{BASE_URL}/{ARTICLE}/de/{identifier:0>6}");
    let res = self.make_request(&url).await?;

    Ok((res, url))
  }

  async fn make_request<T: DeserializeOwned>(&self, url: &str) -> Result<T> {
    log::trace!("making request to: {}", url);
    let req = self
      .client
      .get(url)
      // don't ask, just leave it
      // https://gestis.dguv.de/search -> webpack:///./src/api.ts?
      .bearer_auth("dddiiasjhduuvnnasdkkwUUSHhjaPPKMasd");

    match req.send().await {
      Ok(response) => {
        let code = response.status();
        log::debug!(
          "{} {} - {}",
          code.as_u16(),
          code.canonical_reason().unwrap_or_default(),
          &url
        );
        match response.json().await {
          Ok(json) => Ok(json),
          Err(err) => {
            log::error!("deserializing response failed: {err:?}");
            Err(err.into())
          }
        }
      }
      Err(err) => {
        log::error!("error when requesting url: {url} -> {err:?}");
        if let Some(code) = err.status() {
          if code.as_u16() == 429 {
            return Err(GestisError::RateLimit);
          };
        }
        Err(err.into())
      }
    }
  }

  // see `search/contrib/gestis/helper.rs`
  #[cfg(feature = "gestis_helper")]
  pub async fn get_raw_substance_data(&self, arg: String) -> Result<(GestisResponse, String)> {
    self.get_article(arg).await
  }
}

#[cfg_attr(not(target_family = "wasm"), async_trait)]
#[cfg_attr(target_family = "wasm", async_trait(?Send))]
impl Provider for Gestis {
  fn get_name(&self) -> String {
    NAME.to_string()
  }

  async fn get_quick_search_suggestions(&self, search_type: SearchType, pattern: String) -> SearchResult<Vec<String>> {
    let url = format!(
      "{}/{}/de?{}={}",
      BASE_URL,
      SEARCH_SUGGESTIONS,
      search_type.as_str(),
      pattern
    );

    Ok(self.make_request(&url).await?)
  }

  async fn get_search_results(&self, arguments: SearchArguments) -> SearchResult<Vec<SearchResponse>> {
    let args: Vec<String> = arguments
      .arguments
      .into_iter()
      .map(|a| format!("{}={}", a.search_type.as_str(), a.pattern))
      .collect();

    let url = format!("{BASE_URL}/{SEARCH}/de?{}&exact={}", args.join("&"), arguments.exact,);
    let res = self.make_request(&url).await?;

    Ok(res)
  }

  async fn get_substance_data(&self, identifier: String) -> SearchResult<::types::SubstanceData> {
    let (json, url) = self.get_article(identifier).await?;

    // If you don't have to, save yourself the pain and don't look deeper.
    // See the line below as black box that extracts the substance data you need from the response.
    let data = xml_parser::parse_response(&json, false)?;

    let mut names = Vec::with_capacity(json.aliases.len() + 1);
    names.push(json.name);
    for alias in json.aliases {
      names.push(alias.name);
    }

    let res_data = SubstanceData {
      name: Data::new(names),
      cas: Data::new(data.cas),
      molecular_formula: Data::new(data.molecular_formula),
      molar_mass: Data::new(data.molar_mass),
      melting_point: Data::new(data.melting_point),
      boiling_point: Data::new(data.boiling_point),
      water_hazard_class: Data::new(data.water_hazard_class),
      lethal_dose: Data::new(data.lethal_dose),
      signal_word: Data::new(data.signal_word),
      mak: Data::new(data.mak),
      amount: None,
      h_phrases: Data::new(data.h_phrases),
      p_phrases: Data::new(data.p_phrases),
      symbols: Data::new(data.symbols),
      source: Source {
        provider: IDENTIFIER.to_string(),
        url,
        last_updated: chrono::Utc::now(),
      },

      checked: false,
    };

    Ok(res_data)
  }
}

impl SearchType {
  /// Returns the search type as the string that is used in the query parameters
  pub fn as_str(&self) -> &'static str {
    match self {
      SearchType::ChemicalName => "stoffname",
      SearchType::ChemicalFormula => "summenformel",
      SearchType::Numbers => "nummern",
      SearchType::FullText => "volltextsuche",
    }
  }
}
