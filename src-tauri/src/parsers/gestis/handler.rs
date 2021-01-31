use ureq::Agent;

use super::types::GestisResponse;
use super::xml_parser::Data;
use super::{
  error::{ParseError, Result},
  xml_parser,
};

const BASE_URL: &str = "https://gestis-api.dguv.de/api";
const ARTICLE: &str = "article";

fn make_request(agent: Agent, url: &str) -> Result<ureq::Response> {
  let res = agent.get(&url).call();
  log::debug!("{} - {}", res.status_line(), &url);

  match res.status() {
    200..=399 => Ok(res),
    429 => Err(ParseError::RateLimit),
    _ => Err(ParseError::RequestError(res.status())),
  }
}

pub fn get_chemical_info(agent: Agent, zvg_number: String) -> Result<Data> {
  let url = format!("{}/{}/de/{}", BASE_URL, ARTICLE, zvg_number);
  let res = make_request(agent, &url)?;

  let json: GestisResponse = res.into_json_deserialize()?;

  let data = xml_parser::parse_response(json)?;

  Ok(data)
}
