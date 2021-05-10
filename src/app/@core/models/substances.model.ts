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
  unit: Unit | CustomUnit;
}

export interface GroupMapping {
  viewValue: string;
  unitMappings: Unit[];
}

export interface CustomUnit {
  readonly name: string;
}

export enum Unit {
  LITRE,
  MILLILITER,
  MICROLITER,
  GRAM,
  MILLIGRAM,
  MICROGRAM,
  PIECES,
  MOL,
  MILLIMOL,

  SOLUTION_RELATIVE,
  SOLUTION_MOL,
  SOLUTION_MILLIMOL,
  SOLUTION_MICROMOL,
  SOLUTION_GRAM,
  SOLUTION_MILLIGRAM,

  CUSTOM, // needs String, handle it accordingly

  GRAM_PER_MOL,

  MILLIGRAM_PER_KILOGRAM,
  MILLIGRAM_PER_LITER,

  PARTS_PER_MILLION,

  CELSIUS,
  FAHRENHEIT,
}

// TODO move to i18n service
const unitMapping = new Map<Unit, string>([
  [Unit.LITRE, 'l'],
  [Unit.MILLILITER, 'ml'],
  [Unit.MICROLITER, 'µl'],
  [Unit.GRAM, 'g'],
  [Unit.MILLIGRAM, 'mg'],
  [Unit.MICROGRAM, 'µg'],
  [Unit.MOL, 'mol'],
  [Unit.MILLIMOL, 'mmol'],
  [Unit.PIECES, 'pcs.'], // TODO localize

  [Unit.SOLUTION_RELATIVE, '% (v/v)'],
  [Unit.SOLUTION_MOL, 'mol/l'],
  [Unit.SOLUTION_MILLIMOL, 'mmol/l'],
  [Unit.SOLUTION_MICROMOL, 'µmol/l'],
  [Unit.SOLUTION_GRAM, 'g/l'],
  [Unit.SOLUTION_MILLIGRAM, 'mg/l'],

  [Unit.CUSTOM, 'Custom'], // custom units need special treatment

  [Unit.GRAM_PER_MOL, 'g/mol'],

  [Unit.MILLIGRAM_PER_KILOGRAM, 'mg/kg'],
  [Unit.MILLIGRAM_PER_LITER, 'mg/l'],

  [Unit.PARTS_PER_MILLION, 'ppm'],

  [Unit.CELSIUS, '°C'],
  [Unit.FAHRENHEIT, 'F'],
]);

// TODO move to i18n service
const getViewValue = (unit: Unit): string => {
  const value = unitMapping.get(unit);

  if (value === undefined) {
    throw Error('unknown unit');
  }

  return value;
};

class UnitGroups {
  public readonly substanceUnits = [
    Unit.GRAM,
    Unit.MILLIGRAM,
    Unit.MICROGRAM,
    Unit.LITRE,
    Unit.MILLILITER,
    Unit.MICROLITER,
    Unit.MOL,
    Unit.MILLIMOL,
    Unit.PIECES,
    // Unit.CUSTOM,
  ];
  public readonly solutionUnits = [
    Unit.SOLUTION_MOL,
    Unit.SOLUTION_MILLIMOL,
    Unit.SOLUTION_MICROMOL,
    Unit.SOLUTION_GRAM,
    Unit.SOLUTION_MILLIGRAM,
    // Unit.CUSTOM,
  ];
  public readonly temperatureUnits = [
    Unit.CELSIUS,
    Unit.FAHRENHEIT,
    // Unit.CUSTOM,
  ];
  public readonly lethalUnits = [
    Unit.MILLIGRAM_PER_KILOGRAM,
    Unit.MILLIGRAM_PER_LITER,
    // Unit.CUSTOM,
  ];
  public readonly defaultUnitGroups: GroupMapping[] = [
    // TODO i18n
    { viewValue: 'Reine Substanz', unitMappings: this.substanceUnits },
    { viewValue: 'Lösung', unitMappings: this.solutionUnits },
    { viewValue: 'Custom', unitMappings: [Unit.CUSTOM] },
  ];
}

const unitGroups = new UnitGroups();

export { unitMapping, unitGroups, getViewValue, modifiedOrOriginal };

// these are needed to create new objects every time and don't copy a reference
// because otherwise every filed would reference the same values
const EMPTY_DATA = () => ({ originalData: undefined });
const EMPTY_STRING_DATA = () => ({ originalData: '' });
const EMPTY_LIST_DATA = () => ({ originalData: [] });
