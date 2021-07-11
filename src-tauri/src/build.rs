#[cfg(feature = "tauri_app")]
fn main() {
  tauri_build::build()
}

#[cfg(not(feature = "tauri_app"))]
fn main() {}
