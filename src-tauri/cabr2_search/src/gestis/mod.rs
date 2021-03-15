mod types;
mod xml_parser;

use cabr2_types::{Data, Source, SubstanceData};
use types::GestisResponse;
use ureq::Agent;

use crate::{
  error::{Result, SearchError},
  types::{Provider, SearchArguments, SearchResponse, SearchType},
};

const BASE_URL: &str = "https://gestis-api.dguv.de/api";
const SEARCH_SUGGESTIONS: &str = "search_suggestions";
const SEARCH: &str = "search";
const ARTICLE: &str = "article";

pub struct Gestis {
  agent: Agent,
}

impl Gestis {
  pub fn new() -> Gestis {
    Gestis {
      agent: Agent::new()
        // don't ask, just leave it
        // https://gestis.dguv.de/search -> webpack:///./src/api.ts?
        .auth_kind("Bearer", "dddiiasjhduuvnnasdkkwUUSHhjaPPKMasd")
        .set("User-Agent", &format!("cabr2 v{}", env!("CARGO_PKG_VERSION")))
        .build(),
    }
  }
}

impl Provider for Gestis {
  fn get_quick_search_suggestions(&self, search_type: SearchType, pattern: String) -> Result<Vec<String>> {
    let url = format!(
      "{}/{}/de?{}={}",
      BASE_URL,
      SEARCH_SUGGESTIONS,
      search_type.as_str(),
      pattern
    );
    let res = make_request(&self.agent, &url)?;

    Ok(res.into_json_deserialize()?)
  }

  fn get_search_results(&self, arguments: SearchArguments) -> Result<Vec<SearchResponse>> {
    let args: Vec<String> = arguments
      .arguments
      .into_iter()
      .map(|a| format!("{}={}", a.search_type.as_str(), a.pattern))
      .collect();

    let url = format!(
      "{}/{}/de?{}&exact={}",
      BASE_URL,
      SEARCH,
      args.join("&"),
      arguments.exact,
    );
    let res = make_request(&self.agent, &url)?;

    Ok(res.into_json_deserialize()?)
  }

  fn get_substance_data(&self, identifier: String) -> Result<cabr2_types::SubstanceData> {
    let url = format!("{}/{}/de/{}", BASE_URL, ARTICLE, identifier);
    let res = make_request(&self.agent, &url)?;

    let json: GestisResponse = res.into_json_deserialize()?;

    let data = xml_parser::parse_response(&json)?;

    let res_data = SubstanceData {
      name: Data::new(json.name.clone()),
      alternative_names: json.aliases.into_iter().map(|a| a.name).collect(),
      cas: Data::new(Some(data.cas)),
      molecular_formula: Data::new(data.molecular_formula),
      molar_mass: Data::new(data.molar_mass),
      melting_point: Data::new(data.melting_point),
      boiling_point: Data::new(data.boiling_point),
      water_hazard_class: Data::new(data.water_hazard_class),
      lethal_dose: Data::new(data.lethal_dose),
      signal_word: Data::new(data.signal_word),
      mak: Data::new(data.mak),
      amount: None,
      h_phrases: Data::new(match data.h_phrases {
        Some(inner) => inner,
        None => Vec::new(),
      }),
      p_phrases: Data::new(match data.p_phrases {
        Some(inner) => inner,
        None => Vec::new(),
      }),
      symbols: Data::new(match data.symbols {
        Some(inner) => inner,
        None => Vec::new(),
      }),
      source: Source {
        provider: "GESTIS".into(),
        url,
        last_updated: chrono::Utc::now(),
      },
    };

    Ok(res_data)
  }
}

pub fn make_request(agent: &Agent, url: &str) -> Result<ureq::Response> {
  let res = agent.get(&url).call();
  log::debug!("{} - {}", res.status_line(), &url);

  match res.status() {
    200..=399 => Ok(res),
    429 => Err(SearchError::RateLimit),
    _ => Err(SearchError::RequestError(res.status())),
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
