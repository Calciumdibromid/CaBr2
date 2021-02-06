export interface SubstanceData {
  molecular_formula: Data<string>;
  melting_point?: Data<string>;
  boiling_point?: Data<string>;
  water_hazard_class?: Data<string>;
  h_phrases: Data<[string, string][]>;
  p_phrases: Data<[string, string][]>;
  signal_word?: Data<string>;
  symbols: Data<Image[]>;
  lethal_dose?: Data<string>;
}

interface Data<T> {
  data: T;
  modified: boolean;
}

export interface Image {
  src: string;
  alt: string;
}
