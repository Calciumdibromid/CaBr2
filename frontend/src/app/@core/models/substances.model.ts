interface EmptyData<T> {
  originalData: T;
}

// these are needed to create new objects every time and don't copy a reference
// because otherwise every field would reference the same values
const EMPTY_DATA = (): EmptyData<undefined> => ({ originalData: undefined });
const EMPTY_STRING_DATA = (): EmptyData<string> => ({ originalData: '' });
const EMPTY_LIST_DATA = (): EmptyData<[]> => ({ originalData: [] });

export const EMPTY_VIEW_SUBSTANCE_DATA: ViewSubstanceData = {
  name: '',
  cas: '',
  molecularFormula: '',
  molarMass: '',
  meltingPoint: '',
  boilingPoint: '',
  waterHazardClass: '',
  hPhrases: [],
  pPhrases: [],
  signalWord: '',
  symbols: [],
  lethalDose: '',
  mak: '',
};

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

  checked: boolean;

  /**
   * Create new optionally empty SubstanceData.
   *
   * If `source` is empty it will be treated as custom substance.
   */
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

    this.checked = false;

    if (data) {
      Object.assign(this, data);
    }
  }

  /**
   * Returns `true` if any of its members of type `Data<T>` has `modifiedData` set.
   */
  // this compiles pretty well, we can leave it like this
  get isModified(): boolean {
    // checks if t is of type Data<T>
    const isData = <T>(t: any): t is Data<T> => {
      if (t instanceof Object && 'originalData' in t) {
        return true;
      }
      return false;
    };

    for (const propName in this) {
      if (isData(this[propName])) {
        // data is of type Data<T>
        const data = this[propName] as any;
        if (data.modifiedData !== undefined) {
          return true;
        }
      }
    }

    if (this.amount) {
      return true;
    }

    return false;
  }

  convertToViewSubstanceData(): ViewSubstanceData {
    return {
      name: this.name.modifiedData ?? this.name.originalData,
      cas: this.cas.modifiedData ?? this.cas.originalData,
      molecularFormula: this.molecularFormula.modifiedData ?? this.molecularFormula.originalData,
      molarMass: this.molarMass.modifiedData ?? this.molarMass.originalData,
      meltingPoint: this.meltingPoint.modifiedData ?? this.meltingPoint.originalData,
      boilingPoint: this.boilingPoint.modifiedData ?? this.boilingPoint.originalData,
      waterHazardClass: this.waterHazardClass.modifiedData ?? this.waterHazardClass.originalData,
      hPhrases: this.hPhrases.modifiedData ?? this.hPhrases.originalData,
      pPhrases: this.pPhrases.modifiedData ?? this.pPhrases.originalData,
      signalWord: this.signalWord.modifiedData ?? this.signalWord.originalData,
      symbols: this.symbols.modifiedData ?? this.symbols.originalData,
      lethalDose: this.lethalDose.modifiedData ?? this.lethalDose.originalData,
      mak: this.mak.modifiedData ?? this.mak.originalData,
      amount: this.amount,
    };
  }
}

/**
 * If the Data object has a modified value set it returns this modified value
 * else it returns the original value.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function modifiedOrOriginal<T>(obj: Data<T>): T {
  return obj.modifiedData ?? obj.originalData;
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

export interface ViewSubstanceData {
  name: string;
  cas?: string;
  molecularFormula?: string;
  molarMass?: string;
  meltingPoint?: string;
  boilingPoint?: string;
  waterHazardClass?: string;
  hPhrases: [string, string][];
  pPhrases: [string, string][];
  signalWord?: string;
  symbols: string[];
  lethalDose?: string;
  mak?: string;
  amount?: Amount;
}

export interface Unit {
  type: UnitType;
  name?: string;
}

export interface GroupMapping {
  viewValue: string;
  unitMappings: UnitType[];
}

export enum UnitType {
  LITER = 'LITER',
  MILLILITER = 'MILLILITER',
  MICROLITER = 'MICROLITER',
  GRAM = 'GRAM',
  MILLIGRAM = 'MILLIGRAM',
  MICROGRAM = 'MICROGRAM',
  PIECES = 'PIECES',
  MOL = 'MOL',
  MILLIMOL = 'MILLIMOL',

  SOLUTION_RELATIVE = 'SOLUTION_RELATIVE',
  SOLUTION_MOL = 'SOLUTION_MOL',
  SOLUTION_MILLIMOL = 'SOLUTION_MILLIMOL',
  SOLUTION_MICROMOL = 'SOLUTION_MICROMOL',
  SOLUTION_GRAM = 'SOLUTION_GRAM',
  SOLUTION_MILLIGRAM = 'SOLUTION_MILLIGRAM',

  CUSTOM = 'CUSTOM', // needs String, handle it accordingly

  GRAM_PER_MOL = 'GRAM_PER_MOL',

  MILLIGRAM_PER_KILOGRAM = 'MILLIGRAM_PER_KILOGRAM',
  MILLIGRAM_PER_LITER = 'MILLIGRAM_PER_LITER',

  PARTS_PER_MILLION = 'PARTS_PER_MILLION',

  CELSIUS = 'CELSIUS',
  FAHRENHEIT = 'FAHRENHEIT',
}

const unitMapping = new Map<UnitType, string>([
  [UnitType.LITER, 'l'],
  [UnitType.MILLILITER, 'ml'],
  [UnitType.MICROLITER, 'µl'],
  [UnitType.GRAM, 'g'],
  [UnitType.MILLIGRAM, 'mg'],
  [UnitType.MICROGRAM, 'µg'],
  [UnitType.MOL, 'mol'],
  [UnitType.MILLIMOL, 'mmol'],
  [UnitType.PIECES, 'pcs.'],

  [UnitType.SOLUTION_RELATIVE, '% (v/v)'],
  [UnitType.SOLUTION_MOL, 'mol/l'],
  [UnitType.SOLUTION_MILLIMOL, 'mmol/l'],
  [UnitType.SOLUTION_MICROMOL, 'µmol/l'],
  [UnitType.SOLUTION_GRAM, 'g/l'],
  [UnitType.SOLUTION_MILLIGRAM, 'mg/l'],

  [UnitType.CUSTOM, 'custom'],

  [UnitType.GRAM_PER_MOL, 'g/mol'],

  [UnitType.MILLIGRAM_PER_KILOGRAM, 'mg/kg'],
  [UnitType.MILLIGRAM_PER_LITER, 'mg/l'],

  [UnitType.PARTS_PER_MILLION, 'ppm'],

  [UnitType.CELSIUS, '°C'],
  [UnitType.FAHRENHEIT, 'F'],
]);

const getViewName = (unit: Unit): string => {
  const value = unitMapping.get(unit.type);

  if (value === undefined) {
    throw Error('unknown unit');
  }

  return value;
};

const getViewValue = (unit: Unit): string => {
  if (unit.type === UnitType.CUSTOM) {
    return unit.name ?? '';
  }

  return getViewName(unit);
};

class UnitGroups {
  public readonly substanceUnits = [
    UnitType.GRAM,
    UnitType.MILLIGRAM,
    UnitType.MICROGRAM,
    UnitType.LITER,
    UnitType.MILLILITER,
    UnitType.MICROLITER,
    UnitType.MOL,
    UnitType.MILLIMOL,
    UnitType.PIECES,
  ];

  public readonly solutionUnits = [
    UnitType.SOLUTION_MOL,
    UnitType.SOLUTION_MILLIMOL,
    UnitType.SOLUTION_MICROMOL,
    UnitType.SOLUTION_GRAM,
    UnitType.SOLUTION_MILLIGRAM,
  ];

  public readonly temperatureUnits = [UnitType.CELSIUS, UnitType.FAHRENHEIT];

  public readonly lethalUnits = [UnitType.MILLIGRAM_PER_KILOGRAM, UnitType.MILLIGRAM_PER_LITER];

  public readonly defaultUnitGroups: GroupMapping[] = [
    { viewValue: 'rawSubstance', unitMappings: this.substanceUnits },
    { viewValue: 'solution', unitMappings: this.solutionUnits },
    { viewValue: 'custom', unitMappings: [UnitType.CUSTOM] },
  ];
}

const unitGroups = new UnitGroups();

export { unitMapping, unitGroups, getViewValue, getViewName, modifiedOrOriginal };
