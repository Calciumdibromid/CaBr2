use serde::Serialize;
use warp::hyper::StatusCode;

#[derive(Debug, Serialize)]
pub struct ErrorResponseBody {
  reason: String,
  message: String,
}

impl ErrorResponseBody {
  pub fn new(reason: &str, message: String) -> ErrorResponseBody {
    ErrorResponseBody {
      reason: reason.to_string(),
      message,
    }
  }
}

pub fn generate_error_reply(code: StatusCode, message: String) -> warp::reply::WithStatus<warp::reply::Json> {
  warp::reply::with_status(
    warp::reply::json(&ErrorResponseBody::new(code.canonical_reason().unwrap(), message)),
    code,
  )
}
