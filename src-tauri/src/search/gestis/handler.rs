use serde::{Deserialize, Serialize};
use serde_json::Value;
use ureq::Agent;

use super::error::{Result, SearchError};

const BASE_URL: &str = "https://gestis-api.dguv.de/api";
const SEARCH_SUGGESTIONS: &str = "search_suggestions";
const SEARCH: &str = "search";
const ARTICLE: &str = "article";

const SEARCH_TYPE_NAMES: [&str; 4] = ["stoffname", "nummern", "summenformel", "volltextsuche"];

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum SearchType {
  ChemicalName,
  Numbers,
  EmpiricalFormula,
  FullText,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchArgument {
  search_type: SearchType,
  pattern: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchArguments {
  #[serde(default)]
  exact: bool,
  arguments: Vec<SearchArgument>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchResponse {
  #[serde(rename(deserialize = "zvg_nr"))]
  zvg_number: String,
  #[serde(rename(deserialize = "cas_nr"))]
  cas_number: Option<String>,
  name: String,
}

fn make_request(agent: Agent, url: &str) -> Result<ureq::Response> {
  let res = agent.get(&url).call();
  log::debug!("{} - {}", res.status_line(), &url);

  match res.status() {
    200..=399 => Ok(res),
    429 => Err(SearchError::RateLimit),
    _ => Err(SearchError::RequestError(res.status())),
  }
}

pub fn get_quick_search_suggestions(
  agent: Agent,
  search_type: SearchType,
  pattern: String,
) -> Result<Vec<String>> {
  if pattern.len() < 2 {
    return Ok(vec![]);
  }

  let url = format!(
    "{}/{}/de?{}={}",
    BASE_URL, SEARCH_SUGGESTIONS, SEARCH_TYPE_NAMES[search_type as usize], pattern
  );
  let res = make_request(agent, &url)?;

  Ok(res.into_json_deserialize()?)
}

pub fn get_search_results(agent: Agent, args: SearchArguments) -> Result<Vec<SearchResponse>> {
  let arguments = args.arguments.into_iter().filter(|a| !a.pattern.is_empty());

  if arguments.size_hint().1.unwrap() == 0 {
    return Ok(vec![]);
  }

  let arguments: Vec<String> = arguments
    .map(|a| {
      format!(
        "{}={}",
        SEARCH_TYPE_NAMES[a.search_type as usize], a.pattern
      )
    })
    .collect();

  let url = format!(
    "{}/{}/de?{}&exact={}",
    BASE_URL,
    SEARCH,
    arguments.join("&"),
    args.exact,
  );
  let res = make_request(agent, &url)?;

  Ok(res.into_json_deserialize()?)
}

pub fn get_article(agent: Agent, zvg_number: String) -> Result<Value> {
  let url = format!("{}/{}/de/{}", BASE_URL, ARTICLE, zvg_number);
  let res = make_request(agent, &url)?;

  Ok(res.into_json_deserialize()?)
}
