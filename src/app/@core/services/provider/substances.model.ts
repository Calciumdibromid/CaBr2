export class SubstanceData {
  name: Data<string>;
  readonly alternativeNames: string[];
  cas: Data<string | undefined>;
  molecularFormula: Data<string | undefined>;
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
  amount: Amount | undefined;
  readonly source: Source;

  constructor(data?: Partial<SubstanceData>) {
    this.name = EMPTY_STRING_DATA();
    this.cas = EMPTY_DATA();
    this.molecularFormula = EMPTY_DATA();
    this.molarMass = EMPTY_DATA();
    this.meltingPoint = EMPTY_DATA();
    this.boilingPoint = EMPTY_DATA();
    this.waterHazardClass = EMPTY_DATA();
    this.hPhrases = EMPTY_LIST_DATA();
    this.pPhrases = EMPTY_LIST_DATA();
    this.signalWord = EMPTY_DATA();
    this.symbols = EMPTY_LIST_DATA();
    this.lethalDose = EMPTY_DATA();
    this.mak = EMPTY_DATA();

    this.alternativeNames = [];

    this.source = { url: '', provider: 'custom', lastUpdated: new Date() };

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

const EMPTY_STRING_DATA = () => ({ originalData: '' });
const EMPTY_DATA = () => ({ originalData: undefined });
const EMPTY_LIST_DATA = () => ({ originalData: [] });
