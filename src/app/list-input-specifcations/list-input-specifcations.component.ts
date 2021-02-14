import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list-input-specifcations',
  templateUrl: './list-input-specifcations.component.html',
  styleUrls: ['./list-input-specifcations.component.scss']
})
export class ListInputSpecifcationsComponent implements OnInit {

  @Input()
  elements: string[] = [];

  @Input()
  title = '';

  form: FormGroup;

  addHover = false;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      elements: this.formBuilder.array(this.elements.map(value => this.initForm(value)))
    });
  }

  get controlElements(): FormArray {
    return this.form.get('elements') as FormArray;
  }

  initForm(value: string): FormGroup {
    return this.formBuilder.group({
      value,
      hover: false
    });
  }

  addElement(): void {
    this.controlElements.push(this.initForm(''));
  }

  removeElement(index: number): void {
    this.elements.splice(index, 1);
    this.controlElements.removeAt(index);
  }
}
