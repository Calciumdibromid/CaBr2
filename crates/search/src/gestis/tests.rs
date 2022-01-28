use std::{fs::File, io::BufReader};

use crate::gestis::types::{GestisResponse, ParsedData};

use super::xml_parser::parse_response;

fn load_substance_json(path: &str) -> GestisResponse {
  let file = File::open(path).unwrap();
  let reader = BufReader::new(file);
  serde_json::from_reader(reader).unwrap()
}

#[allow(clippy::too_many_arguments)]
fn make_parsed_data(
  cas: Option<&str>,
  molecular_formula: Option<&str>,
  molar_mass: Option<&str>,
  melting_point: Option<&str>,
  boiling_point: Option<&str>,
  water_hazard_class: Option<&str>,
  h_phrases: &[(&str, &str)],
  p_phrases: &[(&str, &str)],
  signal_word: Option<&str>,
  symbols: &[&str],
  lethal_dose: Option<&str>,
  mak: Option<&str>,
) -> ParsedData {
  ParsedData {
    cas: cas.map(String::from),
    molecular_formula: molecular_formula.map(String::from),
    molar_mass: molar_mass.map(String::from),
    melting_point: melting_point.map(String::from),
    boiling_point: boiling_point.map(String::from),
    water_hazard_class: water_hazard_class.map(String::from),
    h_phrases: map_phrases(h_phrases),
    p_phrases: map_phrases(p_phrases),
    signal_word: signal_word.map(String::from),
    symbols: { || symbols.iter().map(|s| s.to_string()).collect() }(),
    lethal_dose: lethal_dose.map(String::from),
    mak: mak.map(String::from),
  }
}

fn map_phrases(phrases: &[(&str, &str)]) -> Vec<(String, String)> {
  phrases.iter().map(|(n, p)| (n.to_string(), p.to_string())).collect()
}

#[test]
fn test_parsing_bananenöl() {
  assert_eq!(
    make_parsed_data(
      Some("628-63-7"),
      Some("C7H14O2"),
      Some("130,19 g/mol"),
      Some("-71 °C"),
      Some("149 °C"),
      Some("WGK 1"),
      &[
        ("H226", "Flüssigkeit und Dampf entzündbar."),
        ("H412", "Schädlich für Wasserorganismen, mit langfristiger Wirkung.")
      ],
      &[
        (
          "P210",
          "Von Hitze, heißen Oberflächen, Funken, offenen Flammen sowie anderen Zündquellen fernhalten. Nicht rauchen."
        ),
        (
          "P370+P378",
          "Bei Brand: Löschpulver oder Trockensand zum Löschen verwenden."
        )
      ],
      Some("Achtung"),
      &["ghs02"],
      Some(">  1600 mg/kg"),
      None,
    ),
    parse_response(&load_substance_json("tests/assets/bananenöl.json"), true).unwrap()
  )
}

#[test]
fn test_parsing_calcium() {
  assert_eq!(
      make_parsed_data(
        Some("7440-70-2"),
        Some("Ca"),
        Some("40,08 g/mol"),
        Some("839\u{a0}...\u{a0} 841 °C"),
        Some("1484 °C"),
        Some("WGK 1"),
        &[("H261", "In Berührung mit Wasser entstehen entzündbare Gase.")],
        &[("P223", "Keinen Kontakt mit Wasser zulassen."), ("P232", "Vor Feuchtigkeit schützen."), ("P402+P404", "An einem trockenen Ort aufbewahren. In einem geschlossenen Behälter aufbewahren."), ("P501", "Entsorgung des Inhalts / des Behälters gemäß den örtlichen / regionalen / nationalen / internationalen Vorschriften.")],
        Some("Gefahr"),
        &["ghs02"],
        None,
        None,
      ),
      parse_response(&load_substance_json("tests/assets/calcium.json"), true).unwrap()
    )
}

#[test]
fn test_parsing_cobaltdinitrat() {
  assert_eq!(
      make_parsed_data(
        Some("10141-05-6"),
        Some("Co(NO3)2"),
        Some("182,95 g/mol"),
        None,
        None,
        Some("WGK 3"),
        &[("H272", "Kann Brand verstärken; Oxidationsmittel."), ("H302", "Gesundheitsschädlich bei Verschlucken."), ("H317", "Kann allergische Hautreaktionen verursachen."), ("H318", "Verursacht schwere Augenschäden."), ("H332", "Gesundheitsschädlich bei Einatmen."), ("H334", "Kann bei Einatmen Allergie, asthmaartige Symptome oder Atembeschwerden verursachen."), ("H341", "Kann vermutlich genetische Defekte verursachen."), ("H350i", "Kann bei Einatmen Krebs erzeugen."), ("H360F", "Kann die Fruchtbarkeit beeinträchtigen."), ("H410", "Sehr giftig für Wasserorganismen mit langfristiger Wirkung.")],
        &[("P210", "Von Hitze, heißen Oberflächen, Funken, offenen Flammen sowie anderen Zündquellen fernhalten. Nicht rauchen."), ("P280", "Schutzhandschuhe/Schutzkleidung/Augenschutz/Gesichtsschutz tragen."), ("P301+P330+P331", "BEI VERSCHLUCKEN: Mund ausspülen. KEIN Erbrechen herbeiführen."), ("P302+P352", "BEI BERÜHRUNG MIT DER HAUT: Mit viel Wasser und Seife waschen."), ("P304+P340", "BEI EINATMEN: Die Person an die frische Luft bringen und für ungehinderte Atmung sorgen."), ("P305+P351+P338", "BEI KONTAKT MIT DEN AUGEN: Einige Minuten lang behutsam mit Wasser spülen. Eventuell vorhandene Kontaktlinsen nach Möglichkeit entfernen. Weiter spülen."), ("P310", "Sofort GIFTINFORMATIONSZENTRUM oder Arzt anrufen.")],
        Some("Gefahr"),
        &["ghs03", "ghs05", "ghs07", "ghs08", "ghs09"],
        Some("691 mg/kg"),
        None
      ),
      parse_response(&load_substance_json("tests/assets/cobaltdinitrat.json"), true).unwrap()
    )
}

#[test]
fn test_parsing_wasser() {
  assert_eq!(
    make_parsed_data(
      Some("7732-18-5"),
      Some("H2O"),
      Some("18,02 g/mol"),
      Some("0,0 °C"),
      Some("100 °C"),
      None,
      &[],
      &[],
      None,
      &[],
      Some(">  89800 mg/kg"),
      None
    ),
    parse_response(&load_substance_json("tests/assets/wasser.json"), true).unwrap()
  )
}

#[test]
fn test_parsing_wasserglas() {
  assert_eq!(
    make_parsed_data(
      Some("1344-09-8"),
      None,
      None,
      None,
      None,
      Some("WGK 1"),
      &[("H315", "Verursacht Hautreizungen."), ("H319", "Verursacht schwere Augenreizung."), ("H335", "Kann die Atemwege reizen.")],
      &[("P261", "Einatmen von Staub/Rauch/Gas/Nebel/Dampf/Aerosol vermeiden."), ("P262", "Nicht in die Augen, auf die Haut oder auf die Kleidung gelangen lassen."), ("P280", "Schutzhandschuhe/Schutzkleidung/Augenschutz/Gesichtsschutz tragen."), ("P303+P361+P353", "BEI BERÜHRUNG MIT DER HAUT (oder dem Haar): Alle kontaminierten Kleidungsstücke sofort ausziehen. Haut mit Wasser abwaschen oder duschen."), ("P305+P351+P338", "BEI KONTAKT MIT DEN AUGEN: Einige Minuten lang behutsam mit Wasser spülen. Eventuell vorhandene Kontaktlinsen nach Möglichkeit entfernen. Weiter spülen.")],
      Some("Achtung"),
      &["ghs07"],
      None,
      None
    ),
    parse_response(&load_substance_json("tests/assets/wasserglas.json"), true).unwrap()
  )
}

#[test]
fn test_parsing_wasserstoffperoxid() {
  assert_eq!(
    make_parsed_data(
      Some("7722-84-1"),
      Some("H2O2"),
      Some("34,01 g/mol"),
      Some("-0,43 °C"),
      Some("150,2 °C"),
      Some("WGK 1"),
      &[("H271", "Kann Brand oder Explosion verursachen; starkes Oxidationsmittel."), ("H302+H332", "Gesundheitsschädlich bei Verschlucken oder bei Einatmen."), ("H314", "Verursacht schwere Verätzungen der Haut und schwere Augenschäden."), ("H335", "Kann die Atemwege reizen.")],
      &[("P220", "Von Kleidung und anderen brennbaren Materialien fernhalten."), ("P261", "Einatmen von Dampf oder Aerosol vermeiden."), ("P280", "Schutzhandschuhe/Schutzkleidung/Augenschutz/Gesichtsschutz tragen."), ("P302+P352+P310", "BEI BERÜHRUNG MIT DER HAUT: Mit viel Wasser und Seife waschen. Sofort GIFTINFORMATIONSZENTRUM oder Arzt anrufen."), ("P305+P351+P338", "BEI KONTAKT MIT DEN AUGEN: Einige Minuten lang behutsam mit Wasser spülen. Eventuell vorhandene Kontaktlinsen nach Möglichkeit entfernen. Weiter spülen."), ("P312", "Bei Unwohlsein GIFTINFORMATIONSZENTRUM oder Arzt anrufen.")],
      Some("Gefahr"),
      &["ghs03", "ghs05", "ghs07"],
      Some("376 mg/kg"),
      Some("0,71 mg/m³")
    ),
    parse_response(&load_substance_json("tests/assets/wasserstoffperoxid.json"), true).unwrap()
  )
}
