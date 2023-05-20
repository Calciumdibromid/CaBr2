import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Select } from '@ngxs/store';
import { translate } from '@ngneat/transloco';

import {
  Amount,
  Data,
  getViewName,
  modifiedOrOriginal,
  SubstanceData,
  unitGroups,
  UnitType,
  ViewSubstanceData,
} from '../../@core/models/substances.model';
import { GHSSymbolMap, SymbolKeys } from 'src/app/@core/states/ghs-symbols.state';
import { compareArrays } from '../../@core/utils/compare';
import { fixNumberOfControls } from 'src/app/@core/utils/forms.helper';
import Logger from '../../@core/utils/logger';
import { YesNoDialogComponent } from '../yes-no-dialog/yes-no-dialog.component';

type SubstanceDataKeys = keyof ViewSubstanceData;

type AmountForm = {
  [a in keyof Amount]: FormControl<Amount[a] | null>;
};

type SubstanceDataForm =
  | {
      [x in SubstanceDataKeys]: FormControl<string | null> | FormArray<FormGroup> | FormArray<FormControl>;
    }
  | {
      amount: FormGroup<AmountForm>;
    };

type PhrasesForm = {
  phraseNumber: FormControl<string | null>;
  phrase: FormControl<string | null>;
  hover: FormControl<boolean>;
};

const H_PHRASE_PATTERN = /^(H\d{3}\w?\+?)+$/;
const P_PHRASE_PATTERN = /^(?:P\d{3}\+?)+$/;

@Component({
  selector: 'app-edit-substance-data',
  templateUrl: './edit-substance-data.component.html',
  styleUrls: ['./edit-substance-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditSubstanceDataComponent implements OnInit, OnDestroy {
  @Select((state: any) => state.ghs_symbols.symbols) symbols$!: Observable<GHSSymbolMap>;

  @Select((state: any) => state.ghs_symbols.symbolKeys) symbolKeys$!: Observable<SymbolKeys>;

  form!: FormGroup<SubstanceDataForm>;

  addHPhraseHover = false;

  addPPhraseHover = false;

  unit = UnitType;

  unitGroups = unitGroups;

  customUnitVisible = false;

  private destroyed$ = new Subject<void>();

  private logger = new Logger(EditSubstanceDataComponent.name);

  constructor(
    public readonly dialogRef: MatDialogRef<EditSubstanceDataComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: SubstanceData,
    private readonly formBuilder: FormBuilder,
    private readonly dialog: MatDialog,
  ) {}

  get hPhrases(): FormArray<FormGroup<PhrasesForm>> {
    return this.form?.get('hPhrases') as FormArray<FormGroup<PhrasesForm>>;
  }

  get pPhrases(): FormArray<FormGroup<PhrasesForm>> {
    return this.form?.get('pPhrases') as FormArray<FormGroup<PhrasesForm>>;
  }

  get symbols(): FormArray<FormControl<string>> {
    return this.form?.get('symbols') as FormArray<FormControl<string>>;
  }

  get amount(): FormGroup<{ [a in keyof Amount]: FormControl<Amount[a]> }> {
    return this.form?.get('amount') as FormGroup<{ [a in keyof Amount]: FormControl<Amount[a]> }>;
  }

  ngOnInit(): void {
    this.form = this.initControls();

    this.amount
      .get('unit')
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((value: UnitType) => {
        this.customUnitVisible = value === UnitType.CUSTOM;
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  initControls(): FormGroup {
    let amount: AmountForm;

    if (this.data.amount) {
      const amountData = this.data.amount;
      amount = {
        value: this.formBuilder.control(amountData.value),
        unit: this.formBuilder.control(amountData.unit),
        name: this.formBuilder.control(amountData.name),
      };
    } else {
      amount = {
        value: this.formBuilder.control(''),
        unit: this.formBuilder.control(UnitType.GRAM),
        name: this.formBuilder.control(''),
      };
    }

    const group = this.formBuilder.group<SubstanceDataForm>({
      name: this.formBuilder.control(modifiedOrOriginal(this.data.name), Validators.required),
      cas: this.formBuilder.control(modifiedOrOriginal(this.data.cas)),
      molecularFormula: this.formBuilder.control(modifiedOrOriginal(this.data.molecularFormula)),
      molarMass: this.formBuilder.control(modifiedOrOriginal(this.data.molarMass)),
      meltingPoint: this.formBuilder.control(modifiedOrOriginal(this.data.meltingPoint)),
      boilingPoint: this.formBuilder.control(modifiedOrOriginal(this.data.boilingPoint)),
      waterHazardClass: this.formBuilder.control(modifiedOrOriginal(this.data.waterHazardClass)),
      hPhrases: this.formBuilder.array(
        (modifiedOrOriginal<[string, string][]>(this.data.hPhrases) ?? []).map<FormGroup<PhrasesForm>>((hPhrase) =>
          this.initPhrases(hPhrase, H_PHRASE_PATTERN),
        ),
      ),
      pPhrases: this.formBuilder.array(
        (modifiedOrOriginal<[string, string][]>(this.data.pPhrases) ?? []).map<FormGroup<PhrasesForm>>((pPhrase) =>
          this.initPhrases(pPhrase, P_PHRASE_PATTERN),
        ),
      ),
      signalWord: this.formBuilder.control(modifiedOrOriginal(this.data.signalWord)),
      symbols: this.formBuilder.array(modifiedOrOriginal(this.data.symbols) ?? []),
      lethalDose: this.formBuilder.control(modifiedOrOriginal(this.data.lethalDose)),
      mak: this.formBuilder.control(modifiedOrOriginal(this.data.mak)),
      amount: this.formBuilder.group<AmountForm>(amount),
    });

    if (amount.unit.value === UnitType.CUSTOM) {
      this.customUnitVisible = true;
    }

    return group;
  }

  initPhrases(value: [string, string], validationPattern: RegExp): FormGroup<PhrasesForm> {
    return this.formBuilder.group<PhrasesForm>({
      phraseNumber: this.formBuilder.control(value[0], Validators.pattern(validationPattern)),
      phrase: this.formBuilder.control(value[1]),
      hover: this.formBuilder.nonNullable.control(false),
    });
  }

  isSymbolActive(key: string): boolean {
    for (const element of this.symbols.controls) {
      if (element.value === key) {
        return true;
      }
    }

    return false;
  }

  toggleSymbol(key: string): void {
    this.symbols.markAllAsTouched();
    if (this.isSymbolActive(key)) {
      this.symbols.controls.forEach((element, i) => {
        if (element.value === key) {
          this.symbols.removeAt(i);
          return;
        }
      });
    } else {
      this.symbols.push(this.formBuilder.nonNullable.control(key));
    }
  }

  addNewHPhrase(): void {
    this.hPhrases.push(this.initPhrases(['', ''], H_PHRASE_PATTERN));
  }

  addNewPPhrase(): void {
    this.pPhrases.push(this.initPhrases(['', ''], P_PHRASE_PATTERN));
  }

  removePhrase(index: number, formArray: FormArray<FormGroup<PhrasesForm>>): void {
    formArray.removeAt(index);
    formArray.markAllAsTouched();
  }

  localizeUnit(unit: UnitType): string {
    const name = getViewName({ unit });
    const path = `units.${name}`;
    const localizedName: string = translate(path);

    if (localizedName !== path) {
      return localizedName;
    } else {
      return name;
    }
  }

  resetToOriginalData(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    fixNumberOfControls(this.hPhrases, (this.data.hPhrases.originalData[0] ?? []).length, this.hPhrases.length, () =>
      this.initPhrases(['', ''], H_PHRASE_PATTERN),
    );

    fixNumberOfControls(this.pPhrases, (this.data.pPhrases.originalData[0] ?? []).length, this.pPhrases.length, () =>
      this.initPhrases(['', ''], P_PHRASE_PATTERN),
    );

    fixNumberOfControls(this.symbols, (this.data.symbols.originalData[0] ?? []).length, this.symbols.length, () =>
      this.formBuilder.control(''),
    );

    this.form.reset({
      name: this.data.name.originalData[0],
      cas: this.data.cas.originalData[0] ?? '',
      molecularFormula: this.data.molecularFormula.originalData[0] ?? '',
      molarMass: this.data.molarMass.originalData[0] ?? '',
      meltingPoint: this.data.meltingPoint.originalData[0] ?? '',
      boilingPoint: this.data.boilingPoint.originalData[0] ?? '',
      waterHazardClass: this.data.waterHazardClass.originalData[0] ?? '',
      signalWord: this.data.signalWord.originalData[0] ?? '',
      lethalDose: this.data.lethalDose.originalData[0] ?? '',
      mak: this.data.mak.originalData[0] ?? '',
      amount: { value: '', unit: UnitType.GRAM },
      hPhrases: (this.data.hPhrases.originalData[0] ?? []).map<{ [x in keyof PhrasesForm]: string | boolean }>(
        (phrase) => ({
          phraseNumber: phrase[0],
          phrase: phrase[1],
          hover: false,
        }),
      ),
      pPhrases: (this.data.pPhrases.originalData[0] ?? []).map<{ [x in keyof PhrasesForm]: string | boolean }>(
        (phrase) => ({
          phraseNumber: phrase[0],
          phrase: phrase[1],
          hover: false,
        }),
      ),
      symbols: this.data.symbols.originalData[0],
    });

    this.form.markAllAsTouched();
  }

  onSubmit(): void {
    // if form is invalid do nothing
    if (this.form.invalid) {
      this.dialog.open(YesNoDialogComponent, {
        data: {
          iconName: 'error',
          title: translate('substance.invalidFormsTitle'),
          content: translate('substance.invalidFormsContent'),
          listItems: this.checkForInvalidControls(),
          disableCancel: true,
        },
      });
      return;
    }

    // else create SubstanceData from form values and close the dialog with them as return value
    const returnData = new SubstanceData({
      ...this.data,
      name: this.evaluateForm('name', this.data.name),
      cas: this.evaluateForm('cas', this.data.cas),
      molecularFormula: this.evaluateForm('molecularFormula', this.data.molecularFormula),
      molarMass: this.evaluateForm('molarMass', this.data.molarMass),
      meltingPoint: this.evaluateForm('meltingPoint', this.data.meltingPoint),
      boilingPoint: this.evaluateForm('boilingPoint', this.data.boilingPoint),
      waterHazardClass: this.evaluateForm('waterHazardClass', this.data.waterHazardClass),
      hPhrases: this.evaluateFormArray(
        this.hPhrases,
        (value) => [value.get('phraseNumber')?.value, value.get('phrase')?.value],
        this.data.hPhrases,
      ),
      pPhrases: this.evaluateFormArray(
        this.pPhrases,
        (value) => [value.get('phraseNumber')?.value, value.get('phrase')?.value],
        this.data.pPhrases,
      ),
      signalWord: this.evaluateForm('signalWord', this.data.signalWord),
      symbols: this.evaluateFormArray(this.symbols, (symbol) => symbol?.value, this.data.symbols),
      lethalDose: this.evaluateForm('lethalDose', this.data.lethalDose),
      mak: this.evaluateForm('mak', this.data.mak),

      amount: this.evaluateAmount(),
    });

    this.logger.trace('closing with data:', returnData);

    this.dialogRef.close(returnData);
  }

  private checkForInvalidControls(): string[] {
    const reasons: string[] = [];
    if (this.form.get('name')?.invalid) {
      reasons.push(translate('substance.name'));
    }

    if (this.hPhrases.controls.some((control) => control.invalid)) {
      reasons.push(translate('substance.invalidHPhrase'));
    }

    if (this.pPhrases.controls.some((control) => control.invalid)) {
      reasons.push(translate('substance.invalidPPhrase'));
    }

    return reasons;
  }

  /** Custom helper to evaluate whether amount was set or not */
  private evaluateAmount(): Amount | undefined {
    if (this.amount.dirty) {
      const { value, unit, name } = this.amount.value;

      if (unit === undefined) {
        this.logger.error('type is undefined');
        return;
      }

      if (!value) {
        return;
      }

      if ((unit as UnitType) === UnitType.CUSTOM) {
        return { value, unit, name };
      }

      return { value, unit };
    } else {
      return this.data.amount;
    }
  }

  private evaluateForm<T>(formControlName: SubstanceDataKeys, currentData: Data<T>): Data<T> {
    const control = this.form?.get(formControlName);

    if (control?.touched) {
      let retData: Data<T | any> = { originalData: currentData.originalData };
      // if originalData was undefined and the current value is an empty string just return the original data
      if (control.value === '' && currentData.originalData === null) {
        return retData;
      }
      // if new value is empty or still/again the original value don't set modified field
      if (control.value !== undefined && control.value !== currentData.originalData) {
        retData = { ...retData, modifiedData: control.value };
      }
      return retData;
    }
    return currentData;
  }

  private evaluateFormArray<T>(
    formArray: FormArray<FormGroup<PhrasesForm>> | FormArray<FormControl<string>>,
    mapCallback: (value: AbstractControl) => T,
    currentData: Data<T[]>,
    index = 0,
  ): Data<T[]> {
    if (formArray.touched) {
      const newArray = formArray.controls.map(mapCallback);
      let retData: Data<T[]> = { originalData: currentData.originalData };
      // if new value is still/again the original value don't set modified field
      // arrays won't be undefined, so we don't need the extra check here
      if (!compareArrays(newArray, currentData.originalData[index] ?? [])) {
        retData = { ...retData, modifiedData: newArray };
      }
      return retData;
    }
    return currentData;
  }
}
