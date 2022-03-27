import { Actions, ofActionDispatched, Store } from '@ngxs/store';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, switchMap } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

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
import { fixNumberOfControls, stateToElements } from 'src/app/@core/utils/forms.helper';

@Component({
  selector: 'app-modifiable-string-list',
  templateUrl: './modifiable-string-list.component.html',
  styleUrls: ['./modifiable-string-list.component.scss'],
})
export class ModifiableStringListComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  ngxsIdentifier!: string;

  @Input()
  title!: string;

  @Output()
  addEmpty = new EventEmitter();

  @Output()
  remove = new EventEmitter<number>();

  @Output()
  rearrange = new EventEmitter<CdkDragDrop<FormGroup[]>>();

  formGroup: FormGroup = this.formBuilder.group({
    elements: this.formBuilder.array([]),
  });

  addHover = false;

  private subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder, private actions$: Actions, private store: Store) {}

  get controlElements(): FormArray {
    return this.formGroup.get('elements') as FormArray;
  }

  ngOnInit(): void {
    this.subscriptions.push(
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
          switchMap(() => stateToElements(this.store, this.ngxsIdentifier)),
        )
        .subscribe((es) => {
          const elements = es ?? [];

          fixNumberOfControls(this.controlElements, elements?.length, this.controlElements.length, () =>
            this.formBuilder.control(''),
          );
          this.controlElements.patchValue(elements);
        }),
    );
  }

  ngAfterViewInit(): void {
    this.store.dispatch([
      new ResetHumanAndEnvironmentDangerSentences(),
      new ResetRulesOfConductSentences(),
      new ResetInCaseOfDangerSentences(),
      new ResetDisposalSentence(),
    ]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  addElement(): void {
    // this is needed to keep form and state in sync
    this.controlElements.push(this.formBuilder.control(''));
    this.addEmpty.emit();
  }

  removeElement(index: number): void {
    // this is needed to keep form and state in sync
    this.controlElements.removeAt(index);
    this.remove.emit(index);
  }

  drop(event: CdkDragDrop<FormGroup[]>): void {
    this.rearrange.emit(event);
  }
}
