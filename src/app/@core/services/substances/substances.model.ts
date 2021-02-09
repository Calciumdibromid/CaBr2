export interface SubstanceData {
  molecularFormula: Data<string>;
  meltingPoint?: Data<string>;
  boilingPoint?: Data<string>;
  waterHazardClass?: Data<string>;
  hPhrases: Data<[string, string][]>;
  pPhrases: Data<[string, string][]>;
  signalWord?: Data<string>;
  symbols: Data<Image[]>;
  lethalDose?: Data<string>;
}

export interface Data<T> {
  data: T;
  modified: boolean;
}

export interface Image {
  src: string;
  alt: string;
}
