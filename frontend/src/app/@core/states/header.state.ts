import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';

import { Header } from '../interfaces/DocTemplate';
import TEMPLATES from '../../../assets/docsTemplate.json';

const HEADER_TEMPLATE = TEMPLATES.docsTemplate.header;

interface HeaderStateModel {
  headerForm: {
    model?: Header;
  };
}

@State<HeaderStateModel>({
  name: 'header',
  defaults: {
    headerForm: {
      model: HEADER_TEMPLATE,
    },
  },
})
@Injectable()
export class HeaderState {}
