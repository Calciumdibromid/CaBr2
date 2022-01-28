use std::{fs::File, io::BufReader};

use crate::gestis::types::{GestisResponse, ParsedData};

use super::xml_parser::parse_response;

#[derive(Debug, PartialEq)]
pub struct ParsedDataRef {
  pub cas: &'static [&'static str],
  pub molecular_formula: &'static [&'static str],
  pub molar_mass: &'static [&'static str],
  pub melting_point: &'static [&'static str],
  pub boiling_point: &'static [&'static str],
  pub water_hazard_class: &'static [&'static str],
  pub h_phrases: &'static [&'static [(&'static str, &'static str)]],
  pub p_phrases: &'static [&'static [(&'static str, &'static str)]],
  pub signal_word: &'static [&'static str],
  pub symbols: &'static [&'static [&'static str]],
  pub lethal_dose: &'static [&'static str],
  pub mak: &'static [&'static str],
}

impl ParsedDataRef {
  fn to_owned(&self) -> ParsedData {
    ParsedData {
      cas: string_slice_to_vec(self.cas),
      molecular_formula: string_slice_to_vec(self.molecular_formula),
      molar_mass: string_slice_to_vec(self.molar_mass),
      melting_point: string_slice_to_vec(self.melting_point),
      boiling_point: string_slice_to_vec(self.boiling_point),
      water_hazard_class: string_slice_to_vec(self.water_hazard_class),
      h_phrases: phrase_vec_to_slice(self.h_phrases),
      p_phrases: phrase_vec_to_slice(self.p_phrases),
      signal_word: string_slice_to_vec(self.signal_word),
      symbols: self.symbols.iter().map(|v| string_slice_to_vec(v)).collect(),
      lethal_dose: string_slice_to_vec(self.lethal_dose),
      mak: string_slice_to_vec(self.mak),
    }
  }
}

fn string_slice_to_vec(slice: &[&str]) -> Vec<String> {
  slice.iter().map(|s| s.to_string()).collect()
}

fn phrase_vec_to_slice(slice: &[&[(&str, &str)]]) -> Vec<Vec<(String, String)>> {
  slice
    .iter()
    .map(|v| {
      v.iter()
        .map(|t| (t.0.to_string(), t.1.to_string()))
        .collect::<Vec<(String, String)>>()
    })
    .collect()
}

fn load_substance_json(path: &str) -> GestisResponse {
  let file = File::open(path).unwrap();
  let reader = BufReader::new(file);
  serde_json::from_reader(reader).unwrap()
}

/// parser error
#[test]
fn test_parsing_bananenöl() {
  assert_eq!(
    ParsedDataRef {
      cas: &["628-63-7"],
      molecular_formula: &["C7H14O2"],
      molar_mass: &["130,19 g/mol"],
      melting_point: &["-71 °C"],
      boiling_point: &["149 °C"],
      water_hazard_class: &["WGK 1"],
      h_phrases: &[&[
        ("H226", "Flüssigkeit und Dampf entzündbar."),
        ("H412", "Schädlich für Wasserorganismen, mit langfristiger Wirkung.")
      ]],
      p_phrases: &[&[
        (
          "P210",
          "Von Hitze, heißen Oberflächen, Funken, offenen Flammen sowie anderen Zündquellen fernhalten. Nicht rauchen."
        ),
        (
          "P370+P378",
          "Bei Brand: Löschpulver oder Trockensand zum Löschen verwenden."
        )
      ]],
      signal_word: &["Achtung"],
      symbols: &[&["ghs02"]],
      lethal_dose: &[">  1600 mg/kg"],
      mak: &[],
    }
    .to_owned(),
    parse_response(&load_substance_json("tests/assets/bananenöl.json"), true).unwrap()
  )
}

/// element -> no structure diagram before molecular mass
#[test]
fn test_parsing_calcium() {
  assert_eq!(
    ParsedDataRef{
      cas: &["7440-70-2"],
      molecular_formula: &["Ca"],
      molar_mass: &["40,08 g/mol"],
      melting_point: &["839\u{a0}...\u{a0} 841 °C"],
      boiling_point: &["1484 °C"],
      water_hazard_class: &["WGK 1"],
      h_phrases: &[&[("H261", "In Berührung mit Wasser entstehen entzündbare Gase.")]],
      p_phrases: &[&[("P223", "Keinen Kontakt mit Wasser zulassen."), ("P232", "Vor Feuchtigkeit schützen."), ("P402+P404", "An einem trockenen Ort aufbewahren. In einem geschlossenen Behälter aufbewahren."), ("P501", "Entsorgung des Inhalts / des Behälters gemäß den örtlichen / regionalen / nationalen / internationalen Vorschriften.")]],
      signal_word: &["Gefahr"],
      symbols: &[&["ghs02"]],
      lethal_dose: &[],
      mak: &[],
    }
    .to_owned(),
    parse_response(&load_substance_json("tests/assets/calcium.json"), true).unwrap()
  )
}

/// multiple: cas, molecular_formula, lethal_dose
/// no: melting_point, boiling_point
#[test]
fn test_parsing_cobaltdinitrat() {
  assert_eq!(
    ParsedDataRef{
      cas: &["10141-05-6", "10026-22-9"],
      molecular_formula: &["Co(NO3)2", "CoN2O6"],
      molar_mass: &["182,95 g/mol"],
      melting_point: &[],
      boiling_point: &[],
      water_hazard_class: &["WGK 3"],
      h_phrases: &[&[("H272", "Kann Brand verstärken; Oxidationsmittel."), ("H302", "Gesundheitsschädlich bei Verschlucken."), ("H317", "Kann allergische Hautreaktionen verursachen."), ("H318", "Verursacht schwere Augenschäden."), ("H332", "Gesundheitsschädlich bei Einatmen."), ("H334", "Kann bei Einatmen Allergie, asthmaartige Symptome oder Atembeschwerden verursachen."), ("H341", "Kann vermutlich genetische Defekte verursachen."), ("H350i", "Kann bei Einatmen Krebs erzeugen."), ("H360F", "Kann die Fruchtbarkeit beeinträchtigen."), ("H410", "Sehr giftig für Wasserorganismen mit langfristiger Wirkung.")]],
      p_phrases: &[&[("P210", "Von Hitze, heißen Oberflächen, Funken, offenen Flammen sowie anderen Zündquellen fernhalten. Nicht rauchen."), ("P280", "Schutzhandschuhe/Schutzkleidung/Augenschutz/Gesichtsschutz tragen."), ("P301+P330+P331", "BEI VERSCHLUCKEN: Mund ausspülen. KEIN Erbrechen herbeiführen."), ("P302+P352", "BEI BERÜHRUNG MIT DER HAUT: Mit viel Wasser und Seife waschen."), ("P304+P340", "BEI EINATMEN: Die Person an die frische Luft bringen und für ungehinderte Atmung sorgen."), ("P305+P351+P338", "BEI KONTAKT MIT DEN AUGEN: Einige Minuten lang behutsam mit Wasser spülen. Eventuell vorhandene Kontaktlinsen nach Möglichkeit entfernen. Weiter spülen."), ("P310", "Sofort GIFTINFORMATIONSZENTRUM oder Arzt anrufen.")]],
      signal_word: &["Gefahr"],
      symbols: &[&["ghs03", "ghs05", "ghs07", "ghs08", "ghs09"]],
      lethal_dose: &["691 mg/kg", "434 mg/kg"],
      mak: &[],
    }
    .to_owned(),
    parse_response(&load_substance_json("tests/assets/cobaltdinitrat.json"), true).unwrap()
  )
}

/// empty symbols, h- and p-phrases
#[test]
fn test_parsing_wasser() {
  assert_eq!(
    ParsedDataRef {
      cas: &["7732-18-5"],
      molecular_formula: &["H2O"],
      molar_mass: &["18,02 g/mol"],
      melting_point: &["0,0 °C"],
      boiling_point: &["100 °C"],
      water_hazard_class: &[],
      h_phrases: &[],
      p_phrases: &[],
      signal_word: &[],
      symbols: &[],
      lethal_dose: &[">  89800 mg/kg"],
      mak: &[],
    }
    .to_owned(),
    parse_response(&load_substance_json("tests/assets/wasser.json"), true).unwrap()
  )
}

/// multiple symbols, h- and p-phrases and signal-words
#[test]
fn test_parsing_wasserglas() {
  assert_eq!(
    ParsedDataRef{
      cas: &["1344-09-8"],
      molecular_formula: &[],
      molar_mass: &[],
      melting_point: &[],
      boiling_point: &[],
      water_hazard_class: &["WGK 1"],
      h_phrases: &[
        &[("H315", "Verursacht Hautreizungen."), ("H319", "Verursacht schwere Augenreizung."), ("H335", "Kann die Atemwege reizen.")],
        &[("H315", "Verursacht Hautreizungen."), ("H318", "Verursacht schwere Augenschäden."), ("H335", "Kann die Atemwege reizen.")],
      ],
      p_phrases: &[
        &[("P261", "Einatmen von Staub/Rauch/Gas/Nebel/Dampf/Aerosol vermeiden."), ("P262", "Nicht in die Augen, auf die Haut oder auf die Kleidung gelangen lassen."), ("P280", "Schutzhandschuhe/Schutzkleidung/Augenschutz/Gesichtsschutz tragen."), ("P303+P361+P353", "BEI BERÜHRUNG MIT DER HAUT (oder dem Haar): Alle kontaminierten Kleidungsstücke sofort ausziehen. Haut mit Wasser abwaschen oder duschen."), ("P305+P351+P338", "BEI KONTAKT MIT DEN AUGEN: Einige Minuten lang behutsam mit Wasser spülen. Eventuell vorhandene Kontaktlinsen nach Möglichkeit entfernen. Weiter spülen.")],
        &[("P261", "Einatmen von Staub/Rauch/Gas/Nebel/Dampf/Aerosol vermeiden."), ("P262", "Nicht in die Augen, auf die Haut oder auf die Kleidung gelangen lassen."), ("P280", "Schutzhandschuhe/Schutzkleidung/Augenschutz/Gesichtsschutz tragen."), ("P303+P361+P353", "BEI BERÜHRUNG MIT DER HAUT (oder dem Haar): Alle kontaminierten Kleidungsstücke sofort ausziehen. Haut mit Wasser abwaschen oder duschen."), ("P305+P351+P338", "BEI KONTAKT MIT DEN AUGEN: Einige Minuten lang behutsam mit Wasser spülen. Eventuell vorhandene Kontaktlinsen nach Möglichkeit entfernen. Weiter spülen.")],
      ],
      signal_word: &["Achtung", "Gefahr"],
      symbols: &[&["ghs07"], &["ghs05", "ghs07"]],
      lethal_dose: &[],
      mak: &[],
    }
    .to_owned(),
    parse_response(&load_substance_json("tests/assets/wasserglas.json"), true).unwrap()
  )
}

/// multiple lethal doses
#[test]
fn test_parsing_wasserstoffperoxid() {
  assert_eq!(
    ParsedDataRef{
      cas: &["7722-84-1"],
      molecular_formula: &["H2O2"],
      molar_mass: &["34,01 g/mol"],
      melting_point: &["-0,43 °C", "-11,5 °C", "-40,3 °C"],
      boiling_point: &["150,2 °C", "141,3 °C", "125,5 °C"],
      water_hazard_class: &["WGK 1"],
      h_phrases: &[&[("H271", "Kann Brand oder Explosion verursachen; starkes Oxidationsmittel."), ("H302+H332", "Gesundheitsschädlich bei Verschlucken oder bei Einatmen."), ("H314", "Verursacht schwere Verätzungen der Haut und schwere Augenschäden."), ("H335", "Kann die Atemwege reizen.")]],
      p_phrases: &[&[("P220", "Von Kleidung und anderen brennbaren Materialien fernhalten."), ("P261", "Einatmen von Dampf oder Aerosol vermeiden."), ("P280", "Schutzhandschuhe/Schutzkleidung/Augenschutz/Gesichtsschutz tragen."), ("P302+P352+P310", "BEI BERÜHRUNG MIT DER HAUT: Mit viel Wasser und Seife waschen. Sofort GIFTINFORMATIONSZENTRUM oder Arzt anrufen."), ("P305+P351+P338", "BEI KONTAKT MIT DEN AUGEN: Einige Minuten lang behutsam mit Wasser spülen. Eventuell vorhandene Kontaktlinsen nach Möglichkeit entfernen. Weiter spülen."), ("P312", "Bei Unwohlsein GIFTINFORMATIONSZENTRUM oder Arzt anrufen.")]],
      signal_word: &["Gefahr"],
      symbols: &[&["ghs03", "ghs05", "ghs07"]],
      lethal_dose: &["376 mg/kg", "910 mg/kg", "1518 mg/kg"],
      mak: &["0,71 mg/m³"],
    }
    .to_owned(),
    parse_response(&load_substance_json("tests/assets/wasserstoffperoxid.json"), true).unwrap()
  )
}
