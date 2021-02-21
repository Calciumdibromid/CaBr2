import { BehaviorSubject, Observable } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list-input-specifcations',
  templateUrl: './list-input-specifcations.component.html',
  styleUrls: ['./list-input-specifcations.component.scss']
})
export class ListInputSpecifcationsComponent implements OnInit {
  @Output()
  elementEmitter = new EventEmitter<string[]>();

  @Input()
  title = '';

  @Input()
  elements!: string[] | null;

  form: FormGroup;

  addHover = false;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      elements: this.formBuilder.array(this.elements?.map(value => this.initForm(value)) ?? [])
    });
  }

  get controlElements(): FormArray {
    return this.form.get('elements') as FormArray;
  }

  initForm(value: string): FormGroup {
    const form = this.formBuilder.group({
      value,
      hover: false
    });

    form.get('value')?.valueChanges.subscribe(() => this.emitChange());

    return form;
  }

  addElement(): void {
    this.controlElements.push(this.initForm(''));
    this.emitChange();
  }

  removeElement(index: number): void {
    this.elements?.splice(index, 1);
    this.controlElements.removeAt(index);
    this.emitChange();
  }

  private emitChange(): void {
    this.elementEmitter.emit(
      this.controlElements.controls.map((control) => control.get('value')?.value),
    );
  }
}
