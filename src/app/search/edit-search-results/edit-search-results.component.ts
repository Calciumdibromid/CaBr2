import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Image, Data} from '../../@core/services/substances/substances.model';
import {GlobalModel} from '../../@core/models/global.model';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-edit-search-results',
  templateUrl: './edit-search-results.component.html',
  styleUrls: ['./edit-search-results.component.scss']
})
export class EditSearchResultsComponent implements OnInit {

  form: FormGroup;

  addHPhraseHover = false;

  addPPhraseHover = false;

  constructor(
    public dialogRef: MatDialogRef<EditSearchResultsComponent>,
    private globals: GlobalModel,
    @Inject(MAT_DIALOG_DATA) public data: { index: number },
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
  ) {
    this.form = this.initControls();
  }

  ngOnInit(): void {
  }

  initControls(): FormGroup {
    const substanceData = this.globals.substanceData[this.data.index];
    return this.formBuilder.group({
      molecularFormula: substanceData.molecularFormula.data ?? '',
      meltingPoint: substanceData.meltingPoint.data ?? '',
      boilingPoint: substanceData.boilingPoint.data ?? '',
      waterHazardClass: substanceData.waterHazardClass?.data ?? '',
      hPhrases: this.formBuilder.array((substanceData.hPhrases.data ?? []).map(hPhrase => this.initHPhrases(hPhrase))),
      pPhrases: this.formBuilder.array((substanceData.pPhrases.data ?? []).map(pPhrase => this.initPPhrases(pPhrase))),
      signalWord: substanceData.signalWord?.data ?? '',
      symbols: this.formBuilder.array((substanceData.symbols.data ?? []).map(symbol => this.initSymbols(symbol))),
      lethalDose: substanceData.lethalDose?.data ?? '',
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

  initHPhrases(value: [string, string]): FormGroup {
    return this.formBuilder.group({
      hNumber: [value[0], Validators.pattern('^H\\d{3}\\w?$')],
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

  initSymbols(value: Image): FormGroup {
    const {src, alt} = value;
    return this.formBuilder.group({src, alt}) as FormGroup;
  }

  sanitizeImage(imgUrl: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(imgUrl);
  }

  addNewHPhrase(): void {
    this.hPhrases.push(this.initHPhrases(['', '']));
  }

  addNewPPhrase(): void {
    this.pPhrases.push(this.initPPhrases(['', '']));
  }

  removePhrase(index: number, formArray: FormArray): void {
    formArray.removeAt(index);
  }

  close(): void {
    this.form = this.initControls();
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.globals.substanceData[this.data.index] = {
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

    if (!this.form.invalid) {
      this.close();
    }
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
