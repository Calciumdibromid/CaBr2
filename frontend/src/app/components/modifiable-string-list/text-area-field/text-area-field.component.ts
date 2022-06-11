import { AbstractControl, UntypedFormControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-text-area-field',
  templateUrl: './text-area-field.component.html',
  styleUrls: ['./text-area-field.component.scss'],
})
export class TextAreaFieldComponent implements OnInit {
  @Input()
  abstractControl!: AbstractControl;

  @Output()
  removeEmitter = new EventEmitter();

  hover = false;

  isAutoFocus = false;

  get formControl(): UntypedFormControl {
    return this.abstractControl as UntypedFormControl;
  }

  ngOnInit(): void {
    if (this.formControl.value.length === 0) {
      this.isAutoFocus = true;
    }
  }
}
