import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-text-area-field',
  templateUrl: './text-area-field.component.html',
  styleUrls: ['./text-area-field.component.scss'],
})
export class TextAreaFieldComponent implements OnInit {
  @Input()
  form!: FormControl<string>;

  @Output()
  removeEmitter = new EventEmitter();

  hover = false;

  isAutoFocus = false;

  get formControl(): FormControl<string> {
    return this.form as FormControl<string>;
  }

  ngOnInit(): void {
    if (this.form.value.length === 0) {
      this.isAutoFocus = true;
    }
  }
}
