mod merge;
mod types;

use std::{
  borrow::Borrow,
  fs::OpenOptions,
  io::{BufReader, Read},
  path::PathBuf,
  sync::{mpsc, Arc, Mutex},
  thread,
};

use handlebars::{Handlebars, JsonRender};
use lazy_static::lazy_static;
use lopdf::Document;
use serde::Serialize;
use wkhtmltopdf::{Orientation, PageSize, PdfApplication, Size};

use cabr2_config::DATA_DIR;

use self::types::PDFCaBr2Document;
use super::{
  error::{LoadSaveError, Result},
  types::{CaBr2Document, Saver},
};

pub struct PDF;

type PDFThreadChannels = Arc<Mutex<(mpsc::SyncSender<(String, String)>, mpsc::Receiver<Result<Vec<u8>>>)>>;

impl Saver for PDF {
  fn save_document(&self, filename: PathBuf, document: CaBr2Document) -> Result<()> {
    lazy_static! {
      static ref PDF_THREAD_CHANNEL: PDFThreadChannels = Arc::new(Mutex::new(init_pdf_application()));
    }

    let title = document.header.document_title.clone();
    match render_doc(document.into()) {
      Err(e) => Err(e),
      Ok(pages) => {
        let channels = PDF_THREAD_CHANNEL.lock().unwrap();

        let mut pdfs = Vec::with_capacity(2);
        for page in pages {
          channels
            .0
            .send((page, title.clone()))
            .expect("sending data to pdf thread failed");

          let pdf: Vec<u8> = channels.1.recv().expect("receiving data from pdf thread failed")?;
          pdfs.push(pdf);
        }

        let mut documents = Vec::with_capacity(pdfs.len());
        for pdf in pdfs {
          match Document::load_mem(&pdf) {
            Ok(doc) => documents.push(doc),
            Err(_) => return Err(LoadSaveError::PdfMergeError("loading pdf failed".into())),
          }
        }

        let mut merged_pdf = merge::merge_pdfs(documents)?;
        merged_pdf.save(filename)?;

        Ok(())
      }
    }
  }
}

const PDF_TEMPLATE_PAGES: [&str; 2] = ["first", "second"];

const TEST: &str = "R0lGODlhZABkAPcAAP//////zP//mf//Zv//M///AP/M///MzP/Mmf/MZv/MM//MAP+Z//+ZzP+Z
mf+ZZv+ZM/+ZAP9m//9mzP9mmf9mZv9mM/9mAP8z//8zzP8zmf8zZv8zM/8zAP8A//8AzP8Amf8A
Zv8AM/8AAMz//8z/zMz/mcz/Zsz/M8z/AMzM/8zMzMzMmczMZszMM8zMAMyZ/8yZzMyZmcyZZsyZ
M8yZAMxm/8xmzMxmmcxmZsxmM8xmAMwz/8wzzMwzmcwzZswzM8wzAMwA/8wAzMwAmcwAZswAM8wA
AJn//5n/zJn/mZn/Zpn/M5n/AJnM/5nMzJnMmZnMZpnMM5nMAJmZ/5mZzJmZmZmZZpmZM5mZAJlm
/5lmzJlmmZlmZplmM5lmAJkz/5kzzJkzmZkzZpkzM5kzAJkA/5kAzJkAmZkAZpkAM5kAAGb//2b/
zGb/mWb/Zmb/M2b/AGbM/2bMzGbMmWbMZmbMM2bMAGaZ/2aZzGaZmWaZZmaZM2aZAGZm/2ZmzGZm
mWZmZmZmM2ZmAGYz/2YzzGYzmWYzZmYzM2YzAGYA/2YAzGYAmWYAZmYAM2YAADP//zP/zDP/mTP/
ZjP/MzP/ADPM/zPMzDPMmTPMZjPMMzPMADOZ/zOZzDOZmTOZZjOZMzOZADNm/zNmzDNmmTNmZjNm
MzNmADMz/zMzzDMzmTMzZjMzMzMzADMA/zMAzDMAmTMAZjMAMzMAAAD//wD/zAD/mQD/ZgD/MwD/
AADM/wDMzADMmQDMZgDMMwDMAACZ/wCZzACZmQCZZgCZMwCZAABm/wBmzABmmQBmZgBmMwBmAAAz
/wAzzAAzmQAzZgAzMwAzAAAA/wAAzAAAmQAAZgAAMwAAAP///twrGf39/Pr6+fb29fHx8O3t7IyK
iN3c29bV1GBdW3h1cxkUEVJOTL68u6yqqUZBP//8+/318/76+dofC90yIOl0Z/O1rvvp59shD9sk
EtwnFdwqGNwsGtwtG9wtHN44J+uHfe6XjvCmn//9/ebl5f7+/v///yH5BAEAAP8ALAAAAABkAGQA
AAj/AP8JHEiwoMGDCBMqXMiwocOHEB2yi0ixosWLArNplIexo8eP/zSKzAaypEmGI0eeXMkyZEqV
LWN2TEkvZTyZOCm+lCcv5cScQBfSjOdOX8+UQZMapMnOnT8A+uLNG8lRqVKm7tYB2Bp1qsiqVnNi
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
aC0HBAA7";

/// render_doc get CaBr2Document and return html (dummy at the moment)
fn render_doc(document: PDFCaBr2Document) -> Result<Vec<String>> {
  #[derive(Debug, Serialize)]
  struct Context<'a> {
    stylesheet: &'a String,
    document: &'a PDFCaBr2Document,
  }

  lazy_static! {
    static ref REG: Arc<Mutex<Option<(String, Handlebars<'static>)>>> = Arc::new(Mutex::new(None));
  }

  log::debug!("converted data: {:#?}", document);

  let mut reg = REG.lock().unwrap();

  if reg.is_none() {
    *reg = Some(init_handlebars()?);
  }

  let reg = reg.as_ref().unwrap();
  let context = Context {
    stylesheet: &reg.0,
    document: &document,
  };
  Ok(vec![
    reg.1.render(PDF_TEMPLATE_PAGES[0], &context)?,
    reg.1.render(PDF_TEMPLATE_PAGES[1], &context)?,
  ])
}

// handlebar helper render ghs images
fn ghs_symbols(
  h: &handlebars::Helper,
  _: &Handlebars,
  _: &handlebars::Context,
  _: &mut handlebars::RenderContext,
  out: &mut dyn handlebars::Output,
) -> handlebars::HelperResult {
  let param = h.param(0).unwrap();
  out.write("<img class='ghs' src=\"")?;
  out.write(format!("data:image/png;base64,{:#?}", TEST).borrow())?; // TODO: return base64 encoded ghs symbols based on param
  out.write("\" alt=\"")?;
  out.write(param.value().render().as_ref())?; // alt content
  out.write("\" />")?;
  Ok(())
}

#[inline]
fn init_handlebars() -> Result<(String, Handlebars<'static>)> {
  let mut reg = Handlebars::new();
  let mut template_path = DATA_DIR.clone();
  template_path.push("templates");

  for name in PDF_TEMPLATE_PAGES.iter() {
    let mut filename = template_path.clone();
    filename.push(name);
    let filename = filename.with_extension("html");

    log::trace!("template path: {:?}", filename);
    reg.register_template_file(name, filename)?;
  }

  let mut buf = String::new();
  template_path.push("styles.css");
  log::trace!("styles_ path: {:?}", template_path);
  let file = OpenOptions::new().read(true).open(template_path)?;
  let mut reader = BufReader::new(file);
  reader.read_to_string(&mut buf)?;

  reg.register_helper("ghs_symbols", Box::new(ghs_symbols));

  Ok((buf, reg))
}

type PDFChannels = (mpsc::SyncSender<(String, String)>, mpsc::Receiver<Result<Vec<u8>>>);

fn init_pdf_application() -> PDFChannels {
  let (tauri_tx, pdf_rx) = mpsc::sync_channel(0);
  let (pdf_tx, tauri_rx) = mpsc::sync_channel(0);

  /* #region  pdf thread */

  thread::spawn(move || {
    log::debug!("[pdf_thread]: initializing pdf application");
    let mut pdf_app = match PdfApplication::new() {
      Ok(app) => app,
      Err(e) => {
        log::error!("[pdf_thread]: initialization of pdf application failed");
        pdf_tx
          .send(Err(LoadSaveError::PdfError(e)))
          .expect("[pdf_thread]: pdf thread could not send data");
        return;
      }
    };

    loop {
      log::trace!("[pdf_thread]: waiting for html to convert");
      let (html, title) = pdf_rx.recv().expect("[pdf_thread]: pdf thread could not receive data");
      log::trace!("[pdf_thread]: got html");

      // needed for rust to resolve types
      let title: String = title;

      let mut buf = Vec::new();

      let result = match pdf_app
        .builder()
        .page_size(PageSize::A4)
        .orientation(Orientation::Portrait)
        .margin(Size::Millimeters(15))
        .title(&title)
        .build_from_html(&html)
      {
        Ok(mut pdfout) => match pdfout.read_to_end(&mut buf) {
          Ok(_) => Ok(buf),
          Err(e) => Err(LoadSaveError::IOError(e)),
        },
        Err(e) => Err(LoadSaveError::PdfError(e)),
      };

      log::trace!("[pdf_thread]: sending result");
      pdf_tx
        .send(result)
        .expect("[pdf_thread]: pdf thread could not send data");
      log::trace!("[pdf_thread]: finished");
    }
  });

  /* #endregion */

  (tauri_tx, tauri_rx)
}
