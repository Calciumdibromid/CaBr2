import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Image, SubstanceData, Data} from '../../@core/services/substances/substances.model';
import {GlobalModel} from '../../@core/models/global.model';

@Component({
  selector: 'app-edit-search-results',
  templateUrl: './edit-search-results.component.html',
  styleUrls: ['./edit-search-results.component.scss']
})
export class EditSearchResultsComponent implements OnInit {

  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditSearchResultsComponent>,
    private globals: GlobalModel,
    @Inject(MAT_DIALOG_DATA) public data: { index: number },
    private formBuilder: FormBuilder,
  ) {
    // TODO make tuple working with formarray
    const substanceData = this.globals.substances[this.data.index];
    this.form = this.formBuilder.group({
      molecularFormula: substanceData.molecularFormula.data ?? '',
      meltingPoint: substanceData.meltingPoint?.data ?? '',
      boilingPoint: substanceData.boilingPoint?.data ?? '',
      waterHazardClass: substanceData.waterHazardClass?.data ?? '',
      hPhrases: this.formBuilder.array(substanceData.hPhrases.data.map(this.initHPhrases) ?? []),
      pPhrases: this.formBuilder.array(substanceData.pPhrases.data.map(this.initPPhrases) ?? []),
      signalWord: substanceData.signalWord?.data ?? '',
      symbols: this.formBuilder.array(substanceData.symbols.data.map(this.initSymbols) ?? []),
      lethalDose: substanceData.lethalDose?.data ?? '',
    });
  }

  ngOnInit(): void {
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

  initHPhrases(value: [string, string]): FormGroup {
    return this.formBuilder.group({
      hNumber: [value[0], Validators.pattern('^H\d{3}\w?$')],
      hPhrase: value[1],
    });
  }

  initPPhrases(value: [string, string]): FormGroup {
    return this.formBuilder.group({
      pNumber: [value[0], Validators.pattern('^(?:P\d{3}\+?)+$')],
      pPhrase: value[1],
    });
  }

  initSymbols(value: Image): FormGroup {
    const {src, alt} = value;
    return this.formBuilder.group({src, alt}) as FormGroup;
  }

  onSubmit(): void {
    this.globals.substances[this.data.index] = {
      molecularFormula: this.evaluateForm('molecularFormula'),
      meltingPoint: this.evaluateForm('meltingPoint'),
      boilingPoint: this.evaluateForm('boilingPoint'),
      waterHazardClass: this.evaluateForm('waterHazardClass'),
      hPhrases: {
        data: this.hPhrases.controls.map(value => [
          value.get('hNumber')?.value,
          value.get('hPhrase')?.value,
        ]),
        modified: this.hPhrases.dirty,
      },
      pPhrases: {
        data: this.pPhrases.controls.map(value => [
          value.get('pNumber')?.value,
          value.get('pPhrase')?.value,
        ]),
        modified: this.pPhrases.dirty,
      },
      signalWord: this.evaluateForm('signalWord'),
      symbols: {
        data: this.symbols.controls.map<Image>(value => ({
          src: value.get('src')?.value,
          alt: value.get('alt')?.value,
        })),
        modified: this.symbols.dirty,
      },
      lethalDose: this.evaluateForm('lethalDose'),
    };
  }

  private evaluateForm<T>(formControlName: string, formGroup?: FormGroup): Data<T> {
    let formControl;
    if (formGroup) {
      formControl = formGroup.get(formControlName);
    } else {
      formControl = this.form?.get(formControlName);
    }
    return {
      data: formControl?.value,
      modified: !!formControl?.dirty,
    };
  }
}
