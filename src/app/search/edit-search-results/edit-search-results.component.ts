import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import {
  Data,
  SubstanceData,
  TemperatureUnit,
  temperatureUnitMapping,
  Unit,
  unitMappings,
} from '../../@core/services/substances/substances.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalModel } from '../../@core/models/global.model';


@Component({
  selector: 'app-edit-search-results',
  templateUrl: './edit-search-results.component.html',
  styleUrls: ['./edit-search-results.component.scss'],
})
export class EditSearchResultsComponent implements OnInit {
  form: FormGroup;
  substanceData: SubstanceData;

  addHPhraseHover = false;

  addPPhraseHover = false;

  unitMappings = unitMappings;

  unit = Unit;

  temperatureUnitMappings = temperatureUnitMapping;

  temperatureUnit = TemperatureUnit;

  customUnitVisible = false;

  // TODO move that to some global thingy
  symbolKeys: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditSearchResultsComponent>,
    public globals: GlobalModel,
    @Inject(MAT_DIALOG_DATA) public data: { index: number },
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
  ) {
    this.substanceData = this.globals.substanceData[this.data.index];
    this.symbolKeys = Array.from(this.globals.ghsSymbols.keys());
    this.form = this.initControls();
  }

  ngOnInit(): void {
    this.amount.get('unit')?.valueChanges.subscribe((value: Unit) => {
      this.customUnitVisible = value === Unit.CUSTOM;
    });
  }

  initControls(): FormGroup {
    const amount = this.modifiedOrOriginal(this.substanceData.amount) ?? { value: '', unit: Unit.GRAM };
    return this.formBuilder.group({
      name: this.modifiedOrOriginal(this.substanceData.name),
      cas: this.modifiedOrOriginal(this.substanceData.cas) ?? '',
      molecularFormula: this.modifiedOrOriginal(this.substanceData.molecularFormula),
      molarMass: this.modifiedOrOriginal(this.substanceData.molarMass) ?? '',
      meltingPoint: this.modifiedOrOriginal(this.substanceData.meltingPoint) ?? '',
      boilingPoint: this.modifiedOrOriginal(this.substanceData.boilingPoint) ?? '',
      waterHazardClass: this.modifiedOrOriginal(this.substanceData.waterHazardClass) ?? '',
      hPhrases: this.formBuilder.array(
        this.modifiedOrOriginal(this.substanceData.hPhrases).map((hPhrase) => this.initHPhrases(hPhrase)),
      ),
      pPhrases: this.formBuilder.array(
        this.modifiedOrOriginal(this.substanceData.pPhrases).map((pPhrase) => this.initPPhrases(pPhrase)),
      ),
      signalWord: this.modifiedOrOriginal(this.substanceData.signalWord) ?? '',
      symbols: this.formBuilder.array(
        this.modifiedOrOriginal(this.substanceData.symbols),
      ),
      lethalDose: this.modifiedOrOriginal(this.substanceData.lethalDose) ?? '',
      mak: this.modifiedOrOriginal(this.substanceData.mak) ?? '',
      amount: this.formBuilder.group({
        value: [amount.value, Validators.pattern('^\\d[\\d,\\.]*$')],
        unit: amount.unit,
      }),
    });
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
    // TODO return correct value
    return true;
  }

  toggleSymbol(key: string): void {
    // TODO see above
    if (this.isSymbolActive(key)) {
      // this.symbols.removeAt(index);
    } else {
      // this.symbols.push(this.formBuilder.control(Array.from(this.globals.ghsSymbols.keys())[index]));
    }
  }

  sanitizeImage(id: string): SafeResourceUrl | undefined {
    const img = this.globals.ghsSymbols.get(id);
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
    this.form = this.initControls();
    this.dialogRef.close();
  }

  onSubmit(): void {
    const newData: SubstanceData = {
      ...this.substanceData,
      name: this.evaluateForm('name', this.substanceData.name, (value) => value.length === 0),
      cas: this.evaluateForm('cas', this.substanceData.cas, (value) => value?.length === 0),
      molecularFormula: this.evaluateForm(
        'molecularFormula',
        this.substanceData.molecularFormula,
        (value) => value.length === 0,
      ),
      molarMass: this.evaluateForm('molarMass', this.substanceData.molarMass, (value) => value?.length === 0),
      meltingPoint: this.evaluateForm('meltingPoint', this.substanceData.meltingPoint, (value) => value?.length === 0),
      boilingPoint: this.evaluateForm('boilingPoint', this.substanceData.boilingPoint, (value) => value?.length === 0),
      waterHazardClass: this.evaluateForm(
        'waterHazardClass',
        this.substanceData.waterHazardClass,
        (value) => value?.length === 0,
      ),
      hPhrases: this.evaluateFormArray(
        this.hPhrases,
        (value) => [value.get('hNumber')?.value, value.get('hPhrase')?.value],
        this.substanceData.hPhrases,
      ),
      pPhrases: this.evaluateFormArray(
        this.pPhrases,
        (value) => [value.get('pNumber')?.value, value.get('pPhrase')?.value],
        this.substanceData.pPhrases,
      ),
      signalWord: this.evaluateForm('signalWord', this.substanceData.signalWord, (value) => value?.length === 0),
      symbols: this.evaluateFormArray(this.symbols, (value) => value?.value, this.substanceData.symbols),
      lethalDose: this.evaluateForm('lethalDose', this.substanceData.lethalDose, (value) => value?.length === 0),
      mak: this.evaluateForm('mak', this.substanceData.mak, (value) => value?.length === 0),
      amount: this.evaluateFormGroup(
        this.amount,
        (obj) => ({ value: obj.get('value')?.value, unit: obj.get('unit')?.value }),
        (newObj, oldObj) => newObj?.value !== oldObj.modifiedData?.value,
        (obj) => obj?.value.length === 0,
        this.substanceData.amount,
      ),
    };

    if (!this.form.invalid) {
      this.close();
      this.globals.substanceData[this.data.index] = newData;
      this.substanceData = newData;
    } else {
      console.log(`error: ${this.form.errors}`);
    }
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

  private modifiedOrOriginal<T>(obj: Data<T>): T {
    return obj.modifiedData ?? obj.originalData;
  }
}
