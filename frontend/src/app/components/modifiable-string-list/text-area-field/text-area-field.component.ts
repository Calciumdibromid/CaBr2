import { AbstractControl, FormControl } from '@angular/forms';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-text-area-field',
  templateUrl: './text-area-field.component.html',
  styleUrls: ['./text-area-field.component.scss'],
})
export class TextAreaFieldComponent {
  @Input()
  abstractControl!: AbstractControl;

  @Output()
  removeEmitter = new EventEmitter();

  hover = false;

  get formControl(): FormControl {
    return this.abstractControl as FormControl;
  }
}
