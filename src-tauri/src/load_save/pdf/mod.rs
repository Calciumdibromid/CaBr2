use std::path::PathBuf;
use wkhtmltopdf::*;

use super::{
  error::{LoadSaveError, Result},
  types::{CaBr2Document, Saver},
};

pub struct PDF;

impl Saver for PDF {
  fn save_document(&self, _filename: PathBuf, _document: CaBr2Document) -> Result<()> {
    let title = _document.header.document_title.clone();
    match render_doc(_document) {
      Err(e) => Err(LoadSaveError::RenderError(e.to_string())),
      Ok(html) => match PdfApplication::new() {
        Err(e) => Err(LoadSaveError::RenderError(e.to_string())),
        Ok(mut pdf_app) => {
          match pdf_app
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
      },
    }
  }
}

const HTML_TEST: &str = r#"<html><body><div>foo</div></body></html>"#;

// render_doc get CaBr2Document and return html (dummy at the moment)
pub fn render_doc(_document: CaBr2Document) -> Result<String> {
  log::warn!("dummy values");
  return Ok(HTML_TEST.to_string());
}
