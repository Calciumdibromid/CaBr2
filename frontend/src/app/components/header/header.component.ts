import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { EMPTY_HEADER } from 'src/app/@core/models/header.model';
import { Header } from '../../@core/interfaces/DocTemplate';

const form = EMPTY_HEADER;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  header!: Header;

  public formGroup!: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group(form);
  }
}
