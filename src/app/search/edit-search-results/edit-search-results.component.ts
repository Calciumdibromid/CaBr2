import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
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
} from '../../@core/services/substances/substances.model';
import { GlobalModel } from '../../@core/models/global.model';
import { LocalizedStrings } from '../../@core/services/i18n/i18n.service';

@Component({
  selector: 'app-edit-search-results',
  templateUrl: './edit-search-results.component.html',
  styleUrls: ['./edit-search-results.component.scss'],
})
export class EditSearchResultsComponent implements OnInit {
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

  abort = false;

  constructor(
    public dialogRef: MatDialogRef<EditSearchResultsComponent>,
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

  initControls(): FormGroup {
    let amount;
    let amountDirty = false;
    if (this.data.amount) {
      amount = this.data.amount;
      amountDirty = true;
    } else {
      amount = { value: '', unit: Unit.GRAM };
    }

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

    if (amountDirty) {
      group.get('amount')?.markAsDirty();
    }

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

  close(): void {
    this.abort = true;
  }

  onSubmit(): void {
    let returnData;

    if (!this.abort) {
      const newData: SubstanceData = {
        ...this.data,
        name: this.evaluateForm('name', this.data.name, (value) => value.length === 0),
        cas: this.evaluateForm('cas', this.data.cas, (value) => value?.length === 0),
        molecularFormula: this.evaluateForm(
          'molecularFormula',
          this.data.molecularFormula,
          (value) => value.length === 0,
        ),
        molarMass: this.evaluateForm('molarMass', this.data.molarMass, (value) => value?.length === 0),
        meltingPoint: this.evaluateForm('meltingPoint', this.data.meltingPoint, (value) => value?.length === 0),
        boilingPoint: this.evaluateForm('boilingPoint', this.data.boilingPoint, (value) => value?.length === 0),
        waterHazardClass: this.evaluateForm(
          'waterHazardClass',
          this.data.waterHazardClass,
          (value) => value?.length === 0,
        ),
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
        signalWord: this.evaluateForm('signalWord', this.data.signalWord, (value) => value?.length === 0),
        symbols: this.evaluateFormArray(this.symbols, (symbol) => symbol?.value, this.data.symbols),
        lethalDose: this.evaluateForm('lethalDose', this.data.lethalDose, (value) => value?.length === 0),
        mak: this.evaluateForm('mak', this.data.mak, (value) => value?.length === 0),
        amount: this.amount.dirty
          ? {
              value: this.amount.get('value')?.value,
              unit: this.amount.get('unit')?.value,
            }
          : undefined,
      };

      if (!this.form.invalid) {
        returnData = newData;
      } else {
        this.form.markAllAsTouched();
        return;
      }
    }

    this.customSubscription?.unsubscribe();
    this.dialogRef.close(returnData);
  }

  private evaluateForm<T>(
    formControlName: string,
    currentData: Data<T>,
    emptyCallback: (value: T) => boolean,
  ): Data<T> {
    const control = this.form?.get(formControlName);

    if (control?.dirty) {
      let retData: Data<T> = { originalData: currentData.originalData };
      if (control.value !== (currentData.modifiedData ?? '')) {
        if (!emptyCallback(control.value)) {
          retData = { ...retData, modifiedData: control.value };
        }
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
      if (newArray !== (currentData.modifiedData ?? [])) {
        if (newArray.length !== 0) {
          retData = { ...retData, modifiedData: newArray };
        }
      }
      return retData;
    }
    return currentData;
  }

  private evaluateFormGroup<T>(
    formGroup: FormGroup,
    mapCallback: (value: AbstractControl) => T,
    cmpCallback: (newObj: T, oldObj: Data<T>) => boolean,
    emptyCallback: (obj: T) => boolean,
    currentData: Data<T>,
  ): Data<T> {
    if (formGroup.dirty) {
      const newObject = mapCallback(formGroup);
      let retData: Data<T> = { originalData: currentData.originalData };
      if (cmpCallback(newObject, currentData)) {
        if (!emptyCallback(newObject)) {
          retData = { ...retData, modifiedData: newObject };
        }
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
