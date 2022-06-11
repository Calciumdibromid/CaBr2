import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
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
import { fixNumberOfControls } from 'src/app/@core/utils/forms.helper';
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

  form!: UntypedFormGroup;

  addHPhraseHover = false;

  addPPhraseHover = false;

  unit = UnitType;

  unitGroups = unitGroups;

  customUnitVisible = false;

  customSubscription?: Subscription;

  constructor(
    public dialogRef: MatDialogRef<EditSubstanceDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SubstanceData,
    private formBuilder: UntypedFormBuilder,
    private dialog: MatDialog,
  ) {}

  get hPhrases(): UntypedFormArray {
    return this.form?.get('hPhrases') as UntypedFormArray;
  }

  get pPhrases(): UntypedFormArray {
    return this.form?.get('pPhrases') as UntypedFormArray;
  }

  get symbols(): UntypedFormArray {
    return this.form?.get('symbols') as UntypedFormArray;
  }

  get amount(): UntypedFormGroup {
    return this.form?.get('amount') as UntypedFormGroup;
  }

  ngOnInit(): void {
    this.form = this.initControls();

    this.customSubscription = this.amount.get('unit')?.valueChanges.subscribe((value: UnitType) => {
      this.customUnitVisible = value === UnitType.CUSTOM;
    });
  }

  ngOnDestroy(): void {
    this.customSubscription?.unsubscribe();
  }

  initControls(): UntypedFormGroup {
    let amount;

    if (this.data.amount) {
      const amountData = this.data.amount;
      amount = { value: amountData.value, unit: amountData.type, unitName: amountData.name ?? '' };
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
        (modifiedOrOriginal<[string, string][]>(this.data.hPhrases) ?? []).map((hPhrase) => this.initHPhrases(hPhrase)),
      ),
      pPhrases: this.formBuilder.array(
        (modifiedOrOriginal<[string, string][]>(this.data.pPhrases) ?? []).map((pPhrase) => this.initPPhrases(pPhrase)),
      ),
      signalWord: modifiedOrOriginal(this.data.signalWord) ?? '',
      symbols: this.formBuilder.array(modifiedOrOriginal(this.data.symbols) ?? []),
      lethalDose: modifiedOrOriginal(this.data.lethalDose) ?? '',
      mak: modifiedOrOriginal(this.data.mak) ?? '',
      amount: this.formBuilder.group(amount),
    });

    if (amount.unit === UnitType.CUSTOM) {
      this.customUnitVisible = true;
    }

    return group;
  }

  initHPhrases(value: [string, string]): UntypedFormGroup {
    return this.formBuilder.group({
      hNumber: [value[0], Validators.pattern('^(H\\d{3}\\w?\\+?)+$')],
      hPhrase: value[1],
      hover: false,
    });
  }

  initPPhrases(value: [string, string]): UntypedFormGroup {
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

  removePhrase(index: number, formArray: UntypedFormArray): void {
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

    fixNumberOfControls(this.hPhrases, this.data.hPhrases.originalData[0].length, this.hPhrases.length, () =>
      this.initHPhrases(['', '']),
    );

    fixNumberOfControls(this.pPhrases, this.data.pPhrases.originalData[0].length, this.pPhrases.length, () =>
      this.initPPhrases(['', '']),
    );

    fixNumberOfControls(
      this.symbols,
      this.data.symbols.originalData[0].length,
      this.symbols.length,
      () => new UntypedFormControl(),
    );

    this.form.patchValue({
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
      hPhrases: this.data.hPhrases.originalData[0].map((phrase) => ({
        hNumber: phrase[0],
        hPhrase: phrase[1],
        hover: false,
      })),
      pPhrases: this.data.pPhrases.originalData[0].map((phrase) => ({
        pNumber: phrase[0],
        pPhrase: phrase[1],
        hover: false,
      })),
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
        return { value, type: unit, name: this.amount.get('unitName')?.value };
      }

      return { value, type: unit };
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
    formArray: UntypedFormArray,
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
