export interface SubstanceData {
  name: Data<string>;
  alternativeNames: Data<string[]>;
  cas: Data<string | undefined>;
  molecularFormula: Data<string>;
  molarMass: Data<string | undefined>;
  meltingPoint: Data<string | undefined>;
  boilingPoint: Data<string | undefined>;
  waterHazardClass: Data<string | undefined>;
  hPhrases: Data<[string, string][]>;
  pPhrases: Data<[string, string][]>;
  signalWord: Data<string | undefined>;
  symbols: Data<string[]>;
  lethalDose: Data<string | undefined>;
  mak: Data<string | undefined>;
  source: Source;
  amount: Data<Amount | undefined>;
}

interface Data<T> {
  modifiedData?: T;
  originalData: T;
}

export interface Image {
  src: string;
  alt: string;
}

export interface Source {
  provider: string;
  url: string;
  lastUpdated: Date;
}

export interface Amount {
  amount: string;
  unit: Unit;
}

export enum Unit {
  LITRE = 'LITRE',
  MILLILITER = 'MILLILITER',
  MICROLITRE = 'MICROLITRE',
  GRAM = 'GRAM',
  MILLIGRAM = 'MILLIGRAM',
  MICROGRAM = 'MICROGRAM',
  PIECES = 'PIECES',
  CUSTOM = 'CUSTOM', // needs String
}
