import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Store } from '@ngxs/store';

import {
  AddSentence,
  RearrangeSentences,
  RemoveSentence,
} from 'src/app/@core/states/human-and-environment-danger.state';

@Component({
  selector: 'app-modifiable-string-list',
  templateUrl: './modifiable-string-list.component.html',
  styleUrls: ['./modifiable-string-list.component.scss'],
})
export class ModifiableStringListComponent implements OnInit {
  @Input()
  ngxsIdentifier!: string;

  @Input()
  title!: string;

  formGroup!: FormGroup;

  addHover = false;

  constructor(private store: Store, private formBuilder: FormBuilder) {}

  get controlElements(): FormArray {
    return this.formGroup.get('elements') as FormArray;
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      elements: this.formBuilder.array([
        this.formBuilder.group({
          value: '',
        }),
      ]),
    });
  }

  addElement(): void {
    this.controlElements.push(this.initForm(''));
    this.store.dispatch(new AddSentence());
  }

  removeElement(index: number): void {
    this.controlElements.removeAt(index);
    this.store.dispatch(new RemoveSentence(index));
  }

  drop(event: CdkDragDrop<FormGroup[]>): void {
    this.store.dispatch(new RearrangeSentences(event));
  }

  private initForm(value: string): FormGroup {
    return this.formBuilder.group({
      value,
      hover: false,
    });
  }
}
