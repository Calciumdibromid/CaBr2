import { Actions, ofActionDispatched, Store } from '@ngxs/store';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { Subject, switchMap, takeUntil } from 'rxjs';
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
import { StringListForm } from 'src/app/@core/types';

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
  rearrange = new EventEmitter<CdkDragDrop<FormGroup<StringListForm>>>();

  formGroup: FormGroup<StringListForm> = this.formBuilder.group<StringListForm>({
    elements: this.formBuilder.array<FormControl<string>>([]),
  });

  addHover = false;

  private destroyed$ = new Subject<void>();

  constructor(
    private readonly formBuilder: NonNullableFormBuilder,
    private readonly actions$: Actions,
    private readonly store: Store,
  ) {}

  get controlElements(): FormArray<FormControl<string>> {
    return this.formGroup.get('elements') as FormArray<FormControl<string>>;
  }

  ngOnInit(): void {
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
        takeUntil(this.destroyed$),
      )
      .subscribe((es) => {
        const elements = es ?? [];

        fixNumberOfControls(this.controlElements, elements?.length, this.controlElements.length, () =>
          this.formBuilder.control(''),
        );
        this.controlElements.patchValue(elements);
      });
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
    this.destroyed$.next();
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

  drop(event: CdkDragDrop<FormGroup<StringListForm>>): void {
    this.rearrange.emit(event);
  }
}
