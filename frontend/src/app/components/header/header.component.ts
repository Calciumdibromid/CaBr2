import { FormBuilder, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';

import { Header } from '../../@core/interfaces/DocTemplate';

const form: Header = {
  documentTitle: '',
  organization: '',
  labCourse: '',
  name: '',
  place: '',
  assistant: '',
  preparation: '',
};

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  header!: Header;

  public formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group(form);
  }
}
