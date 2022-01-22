import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Store } from '@ngxs/store';

import {
  StringListDispatcherActionMatpping,
  StringListStateModel,
} from 'src/app/@core/interfaces/string-list-state-model.interface';

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

  @Input()
  actions!: StringListDispatcherActionMatpping;

  formGroup!: FormGroup;

  addHover = false;

  constructor(private store: Store, private formBuilder: FormBuilder) {}

  get controlElements(): FormArray {
    return this.formGroup.get('elements') as FormArray;
  }

  ngOnInit(): void {
    this.store
      .selectOnce(
        (state) =>
          // if you think there is a better way, feel free to improve this piece of code
          Object.entries<StringListStateModel>(state)
            .filter((entry) => entry[0] === this.ngxsIdentifier)
            .map((entry) => entry[1])
            .map((value) => value.form.model?.elements)[0],
      )
      .subscribe((elements) => {
        this.formGroup = this.formBuilder.group({
          elements: this.formBuilder.array(elements?.map((element) => this.initForm(element.value)) ?? []),
        });
      });
  }

  addElement(): void {
    this.controlElements.push(this.initForm(''));
    this.store.dispatch(new this.actions.addSentence());
  }

  removeElement(index: number): void {
    this.controlElements.removeAt(index);
    this.store.dispatch(new this.actions.removeSentence(index));
  }

  drop(event: CdkDragDrop<FormGroup[]>): void {
    this.store.dispatch(new this.actions.rearrangeSentence(event));
  }

  private initForm(value: string): FormGroup {
    return this.formBuilder.group({
      value,
    });
  }
}
