import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';

import { EMPTY_HEADER } from 'src/app/@core/models/header.model';
import { Header } from '../../@core/interfaces/DocTemplate';

type FormKeys = keyof Header;
type HeaderForm = {
  [x in FormKeys]: FormControl<string>;
};

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  formGroup!: FormGroup<HeaderForm>;

  constructor(private readonly formBuilder: NonNullableFormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group<HeaderForm>({
      assistant: this.formBuilder.control(EMPTY_HEADER.assistant),
      documentTitle: this.formBuilder.control(EMPTY_HEADER.documentTitle),
      labCourse: this.formBuilder.control(EMPTY_HEADER.labCourse),
      name: this.formBuilder.control(EMPTY_HEADER.name),
      organization: this.formBuilder.control(EMPTY_HEADER.organization),
      place: this.formBuilder.control(EMPTY_HEADER.place),
      preparation: this.formBuilder.control(EMPTY_HEADER.preparation),
    });
  }
}
