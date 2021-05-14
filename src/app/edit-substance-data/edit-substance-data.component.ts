import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import {
  Amount,
  Data,
  getViewValue,
  modifiedOrOriginal,
  SubstanceData,
  Unit,
  unitGroups,
} from '../@core/models/substances.model';
import { compareArrays } from '../@core/utils/compare';
import { GlobalModel } from '../@core/models/global.model';
import { LocalizedStrings } from '../@core/services/i18n/i18n.service';
import Logger from '../@core/utils/logger';
import { YesNoDialogComponent } from '../yes-no-dialog/yes-no-dialog.component';

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

  unit = Unit;

  unitGroups = unitGroups;

  customUnitVisible = false;

  // TODO move that to some global thingy
  symbolKeys!: string[];

  customSubscription?: Subscription;

  getViewValue = getViewValue;

  constructor(
    public dialogRef: MatDialogRef<EditSubstanceDataComponent>,
    public globals: GlobalModel,
    @Inject(MAT_DIALOG_DATA) public data: SubstanceData,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
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
      name: [modifiedOrOriginal(this.data.name), Validators.required],
      cas: modifiedOrOriginal(this.data.cas) ?? '',
      molecularFormula: modifiedOrOriginal(this.data.molecularFormula ?? ''),
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
      amount: this.formBuilder.group({
        value: amount.value,
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

  resetToOriginalData(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    console.log(this.data);

    // https://youtu.be/-AQfQFcXac8
    const fixNumberOfControls = (
      control: FormArray,
      needed: number,
      current: number,
      newCallback: () => AbstractControl,
    ) => {
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
      amount: { value: '', unit: Unit.GRAM },
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
          title: this.strings.substance.invalidFormsTitle,
          content: this.strings.substance.invalidFormsContent,
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
    const reasons = [];
    if (this.form.get('name')?.invalid) {
      reasons.push(this.strings.substance.name);
    }

    if (this.hPhrases.controls.some((control) => control.invalid)) {
      reasons.push(this.strings.substance.invalidHPhrase);
    }

    if (this.pPhrases.controls.some((control) => control.invalid)) {
      reasons.push(this.strings.substance.invalidPPhrase);
    }

    return reasons;
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
