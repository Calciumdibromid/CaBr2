mod merge;
mod types;

use std::{
  fs::OpenOptions,
  io::{BufReader, Read},
  path::PathBuf,
  sync::{mpsc, Arc, Mutex},
  thread,
};

use handlebars::Handlebars;
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
  return Err(LoadSaveError::PdfMergeError("SUCCESS".into()));

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
  let file = OpenOptions::new()
    .read(true)
    .open(template_path.with_file_name("styles").with_extension("css"))?;
  let mut reader = BufReader::new(file);
  reader.read_to_string(&mut buf)?;

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
