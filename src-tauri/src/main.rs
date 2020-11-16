#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod cmd;
mod logging;

use logging::Logger;

fn main() {
  #[cfg(debug_assertions)]
  let logger = Logger::new();
  #[cfg(not(debug_assertions))]
  // TODO: set log_level to Info
  let logger = Logger::new();

  tauri::AppBuilder::new()
    .invoke_handler(|_webview, arg| {
      use cmd::Cmd::*;
      match serde_json::from_str(arg) {
        Err(e) => {
          Err(e.to_string())
        }
        Ok(command) => {
          match command {
            // definitions for your custom commands from Cmd here
            MyCustomCommand { argument } => {
              //  your command code
              println!("{}", argument);
            }
          }
          Ok(())
        }
      }
    })
    .plugin(logger)
    .build()
    .run();
}
