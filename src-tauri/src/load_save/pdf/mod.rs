use lazy_static::lazy_static;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use wkhtmltopdf::*;

use super::{
  error::{LoadSaveError, Result},
  types::{CaBr2Document, Saver},
};

pub struct PDF;

lazy_static! {
  static ref pdf_app: Arc<Mutex<PdfApplication>> =
    Arc::new(Mutex::new(PdfApplication::new().expect("cant initialice wkhtmltopdf")));
}

impl Saver for PDF {
  fn save_document(&self, _filename: PathBuf, _document: CaBr2Document) -> Result<()> {
    let title = _document.header.document_title.clone();
    match render_doc(_document) {
      Err(e) => Err(LoadSaveError::RenderError(e.to_string())),
      Ok(html) => {
        match pdf_app
          .lock()
          .unwrap()
          .builder()
          .orientation(Orientation::Landscape)
          .margin(Size::Millimeters(50))
          .title(title.as_str())
          .build_from_html(&html)
        {
          Err(e) => Err(LoadSaveError::RenderError(e.to_string())),
          Ok(mut pdfout) => match pdfout.save(_filename) {
            Err(e) => Err(LoadSaveError::IOError(e)),
            Ok(_) => Ok(()),
          },
        }
      }
    }
  }
}

const HTML_TEST: &str = r#"<html><body><div>foo</div></body></html>"#;

// render_doc get CaBr2Document and return html (dummy at the moment)
pub fn render_doc(_document: CaBr2Document) -> Result<String> {
  log::warn!("dummy values");
  return Ok(HTML_TEST.to_string());
}
