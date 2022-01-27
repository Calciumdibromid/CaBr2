import { Actions, ofActionDispatched, Store } from '@ngxs/store';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { elementsToFormGroup, initForm, stateToElements } from 'src/app/@core/utils/forms.helper';
import {
  FillSentence as FillDisposalSentence,
  ResetSentences as ResetDisposalSentence,
} from '../../@core/actions/disposal.actions';
import {
  FillSentence as FillHumanAndEnvironmentDangerSentence,
  ResetSentences as ResetHumanAndEnvironmentDangerSentences,
} from '../../@core/actions/human-and-environment-danger.actions';
import {
  FillSentence as FillInCaseOfDangerSentence,
  ResetSentences as ResetInCaseOfDangerSentences,
} from '../../@core/actions/in-case-of-danger.actions';
import {
  FillSentence as FillRulesOfConductSentence,
  ResetSentences as ResetRulesOfConductSentences,
} from '../../@core/actions/rules-of-conduct-acitons';

@Component({
  selector: 'app-modifiable-string-list',
  templateUrl: './modifiable-string-list.component.html',
  styleUrls: ['./modifiable-string-list.component.scss'],
})
export class ModifiableStringListComponent implements OnInit, OnDestroy {
  @Input()
  ngxsIdentifier!: string;

  @Input()
  title!: string;

  @Input()
  formGroup$!: Observable<FormGroup>;

  @Output()
  add = new EventEmitter();

  @Output()
  remove = new EventEmitter<number>();

  @Output()
  rearrange = new EventEmitter<CdkDragDrop<FormGroup[]>>();

  formGroup!: FormGroup;

  addHover = false;

  private subscription!: Subscription;

  constructor(private formBuilder: FormBuilder, private actions$: Actions, private store: Store) {}

  get controlElements(): FormArray {
    return this.formGroup.get('elements') as FormArray;
  }

  ngOnInit(): void {
    this.formGroup$.subscribe((formGroup) => (this.formGroup = formGroup));
    this.actions$
      .pipe(
        ofActionDispatched(
          ResetHumanAndEnvironmentDangerSentences,
          ResetRulesOfConductSentences,
          ResetInCaseOfDangerSentences,
          ResetDisposalSentence,

          FillHumanAndEnvironmentDangerSentence,
          FillRulesOfConductSentence,
          FillInCaseOfDangerSentence,
          FillDisposalSentence,
        ),
      )
      .subscribe(() => {
        this.initFormGroup(this.ngxsIdentifier);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addElement(): void {
    this.controlElements.push(initForm('', this.formBuilder));
    this.add.emit();
  }

  removeElement(index: number): void {
    this.controlElements.removeAt(index);
    this.remove.emit(index);
  }

  drop(event: CdkDragDrop<FormGroup[]>): void {
    this.rearrange.emit(event);
  }

  initFormGroup(identifier: string): void {
    stateToElements(this.store, identifier).subscribe((elements) => {
      this.formGroup = elementsToFormGroup(this.formBuilder, elements);
    });
  }
}
