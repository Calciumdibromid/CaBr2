use serde_json::{to_string_pretty, Value};

use cabr2_types::logging::LogLevel;

#[tauri::command]
pub fn log(level: LogLevel, path: String, messages: Vec<Value>) -> Result<(), String> {
  let mut formatted_messages = Vec::with_capacity(messages.len());
  for message in messages {
    match message {
      Value::String(s) => formatted_messages.push(s),
      _ => match to_string_pretty(&message) {
        Ok(formatted) => formatted_messages.push(formatted),
        Err(e) => return Err(e.to_string()),
      },
    }
  }

  let print_message = formatted_messages.join(" ");
  match level {
    LogLevel::TRACE => log::trace!("[{}] {}", path, print_message),
    LogLevel::DEBUG => log::debug!("[{}] {}", path, print_message),
    LogLevel::INFO => log::info!("[{}] {}", path, print_message),
    LogLevel::WARNING => log::warn!("[{}] {}", path, print_message),
    LogLevel::ERROR => log::error!("[{}] {}", path, print_message),
  }

  Ok(())
}
