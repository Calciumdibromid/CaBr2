export class SubstanceData {
  name: Data<string>;
  readonly alternativeNames: string[];
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
  readonly source!: Source;
  amount: Amount | undefined;

  private readonly EMPTY_STRING_DATA = { originalData: '' };
  private readonly EMPTY_LIST_DATA = { originalData: [] };

  constructor(data?: Partial<SubstanceData>) {
    this.name = this.EMPTY_STRING_DATA;
    this.cas = this.EMPTY_STRING_DATA;
    this.molecularFormula = this.EMPTY_STRING_DATA;
    this.molarMass = this.EMPTY_STRING_DATA;
    this.meltingPoint = this.EMPTY_STRING_DATA;
    this.boilingPoint = this.EMPTY_STRING_DATA;
    this.waterHazardClass = this.EMPTY_STRING_DATA;
    this.hPhrases = this.EMPTY_LIST_DATA;
    this.pPhrases = this.EMPTY_LIST_DATA;
    this.signalWord = this.EMPTY_STRING_DATA;
    this.symbols = this.EMPTY_LIST_DATA;
    this.lethalDose = this.EMPTY_STRING_DATA;
    this.mak = this.EMPTY_STRING_DATA;

    this.alternativeNames = [];

    if (data) {
      Object.assign(this, data);
    }
  }
}

export interface Data<T> {
  modifiedData?: T;
  readonly originalData: T;
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
  value: string;
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
  SOLUTIONRELATIVE = 'SOLUTIONRELATIVE',
  SOLUTIONMOL = 'SOLUTIONMOL',
  SOLUTIONMILLIMOL = 'SOLUTIONMILLIMOL',
  SOLUTIONMICROMOL = 'SOLUTIONMICROMOL',
  CUSTOM = 'CUSTOM', // needs String
}

export enum TemperatureUnit {
  CELSIUS = 'CELSIUS',
  FAHRENHEIT = 'FAHRENHEIT',
}

export interface UnitMapping<T> {
  viewValue: string;
  value: T;
}

export interface GroupMapping<T> {
  viewValue: string;
  unitMappings: UnitMapping<T>[];
}

const unitMappings: GroupMapping<Unit>[] = [
  {
    viewValue: 'Reine Substanz',
    unitMappings: [
      { viewValue: 'l (Liter)', value: Unit.LITRE },
      { viewValue: 'ml (Milliliter)', value: Unit.MILLILITER },
      { viewValue: 'µl (Mikroliter)', value: Unit.MICROLITRE },
      { viewValue: 'g (Gramm)', value: Unit.GRAM },
      { viewValue: 'mg (Milligramm)', value: Unit.MILLIGRAM },
      { viewValue: 'µg (Mikrogramm)', value: Unit.MICROGRAM },
      { viewValue: 'Stück', value: Unit.PIECES },
      { viewValue: 'Custom', value: Unit.CUSTOM }, // TODO implement custom type
    ],
  },
  {
    viewValue: 'Lösung',
    unitMappings: [
      { viewValue: '% (v/v)', value: Unit.SOLUTIONRELATIVE },
      { viewValue: 'mol/l', value: Unit.SOLUTIONMOL },
      { viewValue: 'mmol/l', value: Unit.SOLUTIONMILLIMOL },
      { viewValue: 'µmol/l', value: Unit.SOLUTIONMICROMOL },
    ],
  },
];

const temperatureUnitMapping: UnitMapping<TemperatureUnit>[] = [
  { viewValue: '°C', value: TemperatureUnit.CELSIUS },
  { viewValue: 'F', value: TemperatureUnit.FAHRENHEIT },
];

export { unitMappings, temperatureUnitMapping };
