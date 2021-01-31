export interface Data {
  molecular_formula: string;
  melting_point?: string;
  boiling_point?: string;
  water_hazard_class?: string;
  h_phrases?: [string, string][];
  p_phrases?: [string, string][];
  signal_word?: string;
  symbols?: Image[];
  lethal_dose?: string;
}

export interface Image {
  url: string;
  alt: string;
}
