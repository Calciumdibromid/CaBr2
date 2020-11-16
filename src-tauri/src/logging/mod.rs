mod cmd;

use serde_json::{to_string_pretty, Value};
use tauri::plugin::Plugin;

use cmd::{Cmd, LogLevel};

pub struct Logger {}

impl Logger {
    pub fn new() -> Self {
        Logger {}
    }

    fn handle(&self, level: LogLevel, message: Option<Value>) -> Result<(), String> {
        match to_string_pretty(&message) {
            Ok(message) => {
                match level {
                    LogLevel::DEBUG => println!("[DEBUG] {}", message),
                    LogLevel::INFO => println!("[INFO] {}", message),
                    LogLevel::WARNING => eprintln!("[WARNING] {}", message),
                    LogLevel::ERROR => eprintln!("[ERROR] {}", message),
                }
                Ok(())
            }
            Err(e) => Err(e.to_string()),
        }
    }
}

impl Plugin for Logger {
    fn extend_api(&self, _: &mut tauri::Webview, payload: &str) -> Result<bool, String> {
        match serde_json::from_str(payload) {
            Err(e) => Err(e.to_string()),
            Ok(command) => {
                match command {
                    Cmd::Log { level, message } => self.handle(level, message)?,
                }
                Ok(true)
            }
        }
    }
}
