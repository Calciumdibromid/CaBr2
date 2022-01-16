use serde_json::{to_string_pretty, Value};
use tauri::{async_runtime, plugin::Plugin, Invoke, Runtime, Window};

use ::types::logging::LogLevel;

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

pub struct Logger<R: Runtime> {
  invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync>,
}

impl<R: Runtime> Logger<R> {
  pub fn new() -> Self {
    async_runtime::block_on(::logger::setup_logger()).unwrap();

    Logger {
      invoke_handler: Box::new(tauri::generate_handler![log]),
    }
  }
}

impl<R: Runtime> Plugin<R> for Logger<R> {
  fn name(&self) -> &'static str {
    "cabr2_logger"
  }

  fn extend_api(&mut self, message: Invoke<R>) {
    (self.invoke_handler)(message)
  }

  fn created(&mut self, _: Window<R>) {
    log::trace!("plugin created");
  }
}
