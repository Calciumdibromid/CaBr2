import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
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
} from '../../@core/models/substances.model';
import { GHSSymbolMap, SymbolKeys } from 'src/app/@core/states/ghs-symbols.state';
import { compareArrays } from '../../@core/utils/compare';
import Logger from '../../@core/utils/logger';
import { YesNoDialogComponent } from '../yes-no-dialog/yes-no-dialog.component';

const logger = new Logger('edit-substance-data');

@Component({
  selector: 'app-edit-substance-data',
  templateUrl: './edit-substance-data.component.html',
  styleUrls: ['./edit-substance-data.component.scss'],
})
export class EditSubstanceDataComponent implements OnInit, OnDestroy {
  @Select((state: any) => state.ghs_symbols.symbols) symbols$!: Observable<GHSSymbolMap>;

  @Select((state: any) => state.ghs_symbols.symbolKeys) symbolKeys$!: Observable<SymbolKeys>;

  form: FormGroup;

  addHPhraseHover = false;

  addPPhraseHover = false;

  unit = UnitType;

  unitGroups = unitGroups;

  customUnitVisible = false;

  customSubscription?: Subscription;

  constructor(
    public dialogRef: MatDialogRef<EditSubstanceDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SubstanceData,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
  ) {
    this.form = this.initControls();
  }

  get hPhrases(): FormArray {
    return this.form?.get('hPhrases') as FormArray;
  }

  get pPhrases(): FormArray {
    return this.form?.get('pPhrases') as FormArray;
  }

  get symbols(): FormArray {
    return this.form?.get('symbols') as FormArray;
  }

  get amount(): FormGroup {
    return this.form?.get('amount') as FormGroup;
  }

  ngOnInit(): void {
    this.customSubscription = this.amount.get('unit')?.valueChanges.subscribe((value: UnitType) => {
      this.customUnitVisible = value === UnitType.CUSTOM;
    });
  }

  ngOnDestroy(): void {
    this.customSubscription?.unsubscribe();
  }

  initControls(): FormGroup {
    let amount;

    if (this.data.amount) {
      const a = this.data.amount;
      amount = { value: a.value, unit: a.unit.type, unitName: a.unit.name ?? '' };
    } else {
      amount = { value: '', unit: UnitType.GRAM, unitName: '' };
    }

    const group = this.formBuilder.group({
      name: [modifiedOrOriginal(this.data.name), Validators.required],
      cas: modifiedOrOriginal(this.data.cas) ?? '',
      molecularFormula: modifiedOrOriginal(this.data.molecularFormula) ?? '',
      molarMass: modifiedOrOriginal(this.data.molarMass) ?? '',
      meltingPoint: modifiedOrOriginal(this.data.meltingPoint) ?? '',
      boilingPoint: modifiedOrOriginal(this.data.boilingPoint) ?? '',
      waterHazardClass: modifiedOrOriginal(this.data.waterHazardClass) ?? '',
      hPhrases: this.formBuilder.array(
        modifiedOrOriginal<[string, string][]>(this.data.hPhrases).map((hPhrase) => this.initHPhrases(hPhrase)),
      ),
      pPhrases: this.formBuilder.array(
        modifiedOrOriginal<[string, string][]>(this.data.pPhrases).map((pPhrase) => this.initPPhrases(pPhrase)),
      ),
      signalWord: modifiedOrOriginal(this.data.signalWord) ?? '',
      symbols: this.formBuilder.array(modifiedOrOriginal(this.data.symbols)),
      lethalDose: modifiedOrOriginal(this.data.lethalDose) ?? '',
      mak: modifiedOrOriginal(this.data.mak) ?? '',
      amount: this.formBuilder.group(amount),
    });

    if (amount.unit === UnitType.CUSTOM) {
      this.customUnitVisible = true;
    }

    return group;
  }

  initHPhrases(value: [string, string]): FormGroup {
    return this.formBuilder.group({
      hNumber: [value[0], Validators.pattern('^(H\\d{3}\\w?\\+?)+$')],
      hPhrase: value[1],
      hover: false,
    });
  }

  initPPhrases(value: [string, string]): FormGroup {
    return this.formBuilder.group({
      pNumber: [value[0], Validators.pattern('^(?:P\\d{3}\\+?)+$')],
      pPhrase: value[1],
      hover: false,
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
      this.symbols.push(this.formBuilder.control(key));
    }
  }

  addNewHPhrase(): void {
    this.hPhrases.push(this.initHPhrases(['', '']));
  }

  addNewPPhrase(): void {
    this.pPhrases.push(this.initPPhrases(['', '']));
  }

  removePhrase(index: number, formArray: FormArray): void {
    formArray.removeAt(index);
    formArray.markAllAsTouched();
  }

  localizeUnit(unit: UnitType): string {
    const name = getViewName({ type: unit });
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

    // https://youtu.be/-AQfQFcXac8
    const fixNumberOfControls = (
      control: FormArray,
      needed: number,
      current: number,
      newCallback: () => AbstractControl,
    ): void => {
      const diff = needed - current;
      if (diff > 0) {
        for (let i = diff; i > 0; i--) {
          control.push(newCallback());
        }
      } else if (diff < 0) {
        for (let i = diff; i < 0; i++) {
          control.removeAt(0);
        }
      }
    };

    fixNumberOfControls(this.hPhrases, this.data.hPhrases.originalData.length, this.hPhrases.length, () =>
      this.initHPhrases(['', '']),
    );

    fixNumberOfControls(this.pPhrases, this.data.pPhrases.originalData.length, this.pPhrases.length, () =>
      this.initPPhrases(['', '']),
    );

    fixNumberOfControls(
      this.symbols,
      this.data.symbols.originalData.length,
      this.symbols.length,
      () => new FormControl(),
    );

    this.form.patchValue({
      name: this.data.name.originalData,
      cas: this.data.cas.originalData ?? '',
      molecularFormula: this.data.molecularFormula.originalData ?? '',
      molarMass: this.data.molarMass.originalData ?? '',
      meltingPoint: this.data.meltingPoint.originalData ?? '',
      boilingPoint: this.data.boilingPoint.originalData ?? '',
      waterHazardClass: this.data.waterHazardClass.originalData ?? '',
      signalWord: this.data.signalWord.originalData ?? '',
      lethalDose: this.data.lethalDose.originalData ?? '',
      mak: this.data.mak.originalData ?? '',
      amount: { value: '', unit: UnitType.GRAM },
      hPhrases: this.data.hPhrases.originalData.map((phrase) => ({
        hNumber: phrase[0],
        hPhrase: phrase[1],
        hover: false,
      })),
      pPhrases: this.data.pPhrases.originalData.map((phrase) => ({
        pNumber: phrase[0],
        pPhrase: phrase[1],
        hover: false,
      })),
      symbols: this.data.symbols.originalData,
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
        (value) => [value.get('hNumber')?.value, value.get('hPhrase')?.value],
        this.data.hPhrases,
      ),
      pPhrases: this.evaluateFormArray(
        this.pPhrases,
        (value) => [value.get('pNumber')?.value, value.get('pPhrase')?.value],
        this.data.pPhrases,
      ),
      signalWord: this.evaluateForm('signalWord', this.data.signalWord),
      symbols: this.evaluateFormArray(this.symbols, (symbol) => symbol?.value, this.data.symbols),
      lethalDose: this.evaluateForm('lethalDose', this.data.lethalDose),
      mak: this.evaluateForm('mak', this.data.mak),

      amount: this.evaluateAmount(),
    });

    logger.trace('closing with data:', returnData);

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
      const value = this.amount.get('value')?.value;

      if (!value) {
        return undefined;
      }

      const unit = this.amount.get('unit')?.value;

      if ((unit as UnitType) === UnitType.CUSTOM) {
        return { value, unit: { type: unit, name: this.amount.get('unitName')?.value } };
      }

      return { value, unit: { type: unit } };
    } else {
      return this.data.amount;
    }
  }

  private evaluateForm<T>(formControlName: string, currentData: Data<T>): Data<T> {
    const control = this.form?.get(formControlName);

    if (control?.touched) {
      let retData: Data<T> = { originalData: currentData.originalData };
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
    formArray: FormArray,
    mapCallback: (value: AbstractControl) => T,
    currentData: Data<T[]>,
  ): Data<T[]> {
    if (formArray.touched) {
      const newArray = formArray.controls.map(mapCallback);
      let retData: Data<T[]> = { originalData: currentData.originalData };
      // if new value is still/again the original value don't set modified field
      // arrays won't be undefined, so we don't need the extra check here
      if (!compareArrays(newArray, currentData.originalData)) {
        retData = { ...retData, modifiedData: newArray };
      }
      return retData;
    }
    return currentData;
  }
}
