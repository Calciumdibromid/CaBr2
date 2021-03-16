import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import {
  Amount,
  Data,
  SubstanceData,
  TemperatureUnit,
  temperatureUnitMapping,
  Unit,
  unitMappings,
} from '../@core/services/provider/substances.model';
import { compareArrays } from '../@core/utils/compare';
import { GlobalModel } from '../@core/models/global.model';
import { LocalizedStrings } from '../@core/services/i18n/i18n.service';
import Logger from '../@core/utils/logger';

const logger = new Logger('edit-substance-data');

@Component({
  selector: 'app-edit-substance-data',
  templateUrl: './edit-substance-data.component.html',
  styleUrls: ['./edit-substance-data.component.scss'],
})
export class EditSubstanceDataComponent implements OnInit, OnDestroy {
  form: FormGroup;

  strings!: LocalizedStrings;

  addHPhraseHover = false;

  addPPhraseHover = false;

  unitMappings = unitMappings;

  unit = Unit;

  temperatureUnitMappings = temperatureUnitMapping;

  temperatureUnit = TemperatureUnit;

  customUnitVisible = false;

  // TODO move that to some global thingy
  symbolKeys!: string[];

  customSubscription?: Subscription;

  constructor(
    public dialogRef: MatDialogRef<EditSubstanceDataComponent>,
    public globals: GlobalModel,
    @Inject(MAT_DIALOG_DATA) public data: SubstanceData,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
  ) {
    this.globals.localizedStringsObservable.subscribe((strings) => (this.strings = strings));

    this.form = this.initControls();
  }

  ngOnInit(): void {
    this.symbolKeys = Array.from(this.globals.ghsSymbols.keys());
    this.customSubscription = this.amount.get('unit')?.valueChanges.subscribe((value: Unit) => {
      this.customUnitVisible = value === Unit.CUSTOM;
    });
  }

  ngOnDestroy(): void {
    this.customSubscription?.unsubscribe();
  }

  initControls(): FormGroup {
    const amount = this.data.amount ?? { value: '', unit: Unit.GRAM };

    const group = this.formBuilder.group({
      name: [this.modifiedOrOriginal(this.data.name), Validators.required],
      cas: this.modifiedOrOriginal(this.data.cas) ?? '',
      molecularFormula: this.modifiedOrOriginal(this.data.molecularFormula),
      molarMass: this.modifiedOrOriginal(this.data.molarMass) ?? '',
      meltingPoint: this.modifiedOrOriginal(this.data.meltingPoint) ?? '',
      boilingPoint: this.modifiedOrOriginal(this.data.boilingPoint) ?? '',
      waterHazardClass: this.modifiedOrOriginal(this.data.waterHazardClass) ?? '',
      hPhrases: this.formBuilder.array(
        this.modifiedOrOriginal<[string, string][]>(this.data.hPhrases).map((hPhrase) => this.initHPhrases(hPhrase)),
      ),
      pPhrases: this.formBuilder.array(
        this.modifiedOrOriginal<[string, string][]>(this.data.pPhrases).map((pPhrase) => this.initPPhrases(pPhrase)),
      ),
      signalWord: this.modifiedOrOriginal(this.data.signalWord) ?? '',
      symbols: this.formBuilder.array(this.modifiedOrOriginal(this.data.symbols)),
      lethalDose: this.modifiedOrOriginal(this.data.lethalDose) ?? '',
      mak: this.modifiedOrOriginal(this.data.mak) ?? '',
      amount: this.formBuilder.group({
        value: [amount.value, Validators.pattern('^\\d[\\d,\\.]*$')],
        unit: amount.unit,
      }),
    });

    return group;
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

  sanitizeImage(key: string): SafeResourceUrl | undefined {
    const img = this.globals.ghsSymbols.get(key);
    if (img) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(img);
    }

    return undefined;
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

  onSubmit(): void {
    // if form is invalid do nothing
    if (this.form.invalid) {
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

  /** Custom helper to evaluate wether amount was set or not */
  private evaluateAmount(): Amount | undefined {
    if (this.amount.dirty) {
      const value = this.amount.get('value')?.value;
      return value ? { value, unit: this.amount.get('unit')?.value } : undefined;
    } else {
      return this.data.amount;
    }
  }

  private evaluateForm<T>(formControlName: string, currentData: Data<T>): Data<T> {
    const control = this.form?.get(formControlName);

    if (control?.dirty) {
      let retData: Data<T> = { originalData: currentData.originalData };
      // if new value is empty or still/again the original value don't set modified field
      if (control.value && control.value !== currentData.originalData) {
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
      const newArray = formArray.controls.map(mapCallback).sort((a, b) => (a === b ? 0 : a > b ? 1 : -1));
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

  // TODO move to SubstanceData class
  private modifiedOrOriginal<T>(obj: Data<T>): T {
    return obj.modifiedData ?? obj.originalData;
  }
}
