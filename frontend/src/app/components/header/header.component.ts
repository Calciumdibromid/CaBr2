import { FormBuilder, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';

import { EMPTY_HEADER } from 'src/app/@core/models/header.model';
import { Header } from '../../@core/interfaces/DocTemplate';

const form = EMPTY_HEADER;

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
