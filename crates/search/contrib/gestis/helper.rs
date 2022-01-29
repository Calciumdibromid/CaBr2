use std::{
  fs::{self, OpenOptions},
  io::{BufWriter, Write},
  path::PathBuf,
};

use env_logger::{fmt::Color, Builder, Env};
use structopt::StructOpt;

use search::{
  gestis::{self, types::GestisResponse},
  types::Provider,
};

/// This binary uses the `env_logger`.
/// Just set the environment variable `RUST_LOG` to `debug` to see the debug output.
///
/// Other examples:
///
/// - RUST_LOG=search=trace -> show all log messages in search crate
///
/// - RUST_LOG=search::gestis::xml_parser=debug -> just show the debug messages of the xml parser
#[derive(StructOpt, Debug)]
#[structopt(name = "gestis_helper")]
struct Arguments {
  /// Extract XMLs from gestis id
  #[structopt(short, long)]
  pub extract: Option<String>,

  /// Parse and print substance with gestis id
  #[structopt(short, long)]
  pub parse: Option<String>,

  /// Delete all extracted XMLs
  #[structopt(short, long)]
  pub clean: bool,

  /// Print less information, e.g. just errors od debug information with '--parse'
  #[structopt(short, long)]
  pub quiet: bool,
}

#[tokio::main]
async fn main() {
  init_logger();

  let args = Arguments::from_args();

  if args.parse.is_some() {
    let gestis = gestis::Gestis::new(reqwest::ClientBuilder::new().build().unwrap());

    let res = gestis.get_substance_data(args.parse.unwrap()).await.unwrap();

    if !args.quiet {
      println!("{res:#?}");
    }
  } else if args.extract.is_some() {
    let gestis = gestis::Gestis::new(reqwest::ClientBuilder::new().build().unwrap());
    let (res, _) = gestis.get_raw_substance_data(args.extract.unwrap()).await.unwrap();

    extract_xmls(&res).unwrap();
  } else if args.clean {
    fs::remove_dir_all("gestis_helper").expect("removing 'gestis_helper' folder failed");
  }
}

fn extract_xmls(res: &GestisResponse) -> std::io::Result<()> {
  let mut folder = PathBuf::from("gestis_helper");
  folder.push(&res.name);
  fs::create_dir_all(&folder)?;

  let mut response_file = folder.clone();
  response_file.push("@response.json"); // response should be at the top of the folder
  let file = OpenOptions::new().write(true).create(true).open(response_file)?;
  let writer = BufWriter::new(file);
  serde_json::to_writer_pretty(writer, res)?;

  println!("extracting: {}.json", res.name);

  let mapping = gestis::functions::parse_chapters(res);

  for (chapter_name, xml) in [
    ("boiling_point", mapping.boiling_point),
    ("cas_number", mapping.cas_number),
    ("h_p_signal_symbols", mapping.h_p_signal_symbols),
    ("lethal_dose", mapping.lethal_dose),
    ("agw", mapping.agw),
    ("mak", mapping.mak),
    ("melting_point", mapping.melting_point),
    ("molecular_formula_molar_mass", mapping.molecular_formula_molar_mass),
    ("water_hazard_class", mapping.water_hazard_class),
  ] {
    print!("  trying: {} ... ", chapter_name);

    match xml {
      Some(xml) => {
        let mut filename = folder.clone();
        filename.push(chapter_name);

        let mut file = OpenOptions::new()
          .create(true)
          .write(true)
          .open(filename.with_extension("xml"))?;

        file.write_all(xml.as_bytes())?;

        println!("\x1B[32mSUCCESS\x1B[m");
      }
      None => {
        println!("\x1B[31mNO_XML\x1B[m");
        continue;
      }
    }
  }

  Ok(())
}

fn init_logger() {
  let env = Env::default();

  Builder::from_env(env)
    .format(|buf, record| {
      let mut rest_style = buf.style();
      rest_style.set_bold(true);
      let mut level_style = rest_style.clone();

      match record.level() {
        log::Level::Error => level_style.set_color(Color::Red),
        log::Level::Warn => level_style.set_color(Color::Yellow),
        log::Level::Info => level_style.set_color(Color::White),
        log::Level::Debug => level_style.set_color(Color::Blue),
        log::Level::Trace => level_style.set_color(Color::Magenta),
      };

      writeln!(
        buf,
        "[{}][{}][{}:{}] {}",
        rest_style.value(buf.timestamp_micros()),
        level_style.value(record.level()),
        rest_style.value(record.target()),
        rest_style.value(record.line().unwrap_or(0)),
        record.args(),
      )
    })
    .init();
}
