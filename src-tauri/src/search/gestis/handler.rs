use ureq::Agent;

use crate::types::Source;

use super::{
  error::{Result, SearchError},
  types::{Data, GestisResponse, SearchArguments, SearchResponse, SearchType, SubstanceData},
  xml_parser,
};

const BASE_URL: &str = "https://gestis-api.dguv.de/api";
const SEARCH_SUGGESTIONS: &str = "search_suggestions";
const SEARCH: &str = "search";
const ARTICLE: &str = "article";

const SEARCH_TYPE_NAMES: [&str; 4] = ["stoffname", "nummern", "summenformel", "volltextsuche"];

fn make_request(agent: &Agent, url: &str) -> Result<ureq::Response> {
  let res = agent.get(&url).call();
  log::debug!("{} - {}", res.status_line(), &url);

  match res.status() {
    200..=399 => Ok(res),
    429 => Err(SearchError::RateLimit),
    _ => Err(SearchError::RequestError(res.status())),
  }
}

pub fn get_quick_search_suggestions(agent: Agent, search_type: SearchType, pattern: String) -> Result<Vec<String>> {
  if pattern.len() < 2 {
    return Ok(vec![]);
  }

  let url = format!(
    "{}/{}/de?{}={}",
    BASE_URL, SEARCH_SUGGESTIONS, SEARCH_TYPE_NAMES[search_type as usize], pattern
  );
  let res = make_request(&agent, &url)?;

  Ok(res.into_json_deserialize()?)
}

pub fn get_search_results(agent: Agent, args: SearchArguments) -> Result<Vec<SearchResponse>> {
  let arguments = args.arguments.into_iter().filter(|a| !a.pattern.is_empty());

  if arguments.size_hint().1.unwrap() == 0 {
    return Ok(vec![]);
  }

  let arguments: Vec<String> = arguments
    .map(|a| format!("{}={}", SEARCH_TYPE_NAMES[a.search_type as usize], a.pattern))
    .collect();

  let url = format!(
    "{}/{}/de?{}&exact={}",
    BASE_URL,
    SEARCH,
    arguments.join("&"),
    args.exact,
  );
  let res = make_request(&agent, &url)?;

  Ok(res.into_json_deserialize()?)
}

pub fn get_substance_data(agent: Agent, zvg_number: String) -> Result<SubstanceData> {
  let url = format!("{}/{}/de/{}", BASE_URL, ARTICLE, zvg_number);
  let res = make_request(&agent, &url)?;

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
    amount: Data::new(None),
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
      provider: "gestis".into(),
      url: "".into(),
      last_updated: chrono::Utc::now(),
    },
  };

  Ok(res_data)
}
