import { Action, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';

import { Header } from '../interfaces/DocTemplate';
import TEMPLATES from '../../../assets/docsTemplate.json';

const HEADER_TEMPLATE = TEMPLATES.docsTemplate.header;

interface HeaderStateModel {
  headerForm: {
    model?: Header;
  };
}

export class ResetHeader {
  static readonly type = '[Header] reset header to default values';
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
export class HeaderState {
  @Action(ResetHeader)
  resetHeader(context: StateContext<HeaderStateModel>): void {
    context.setState({
      headerForm: {
        model: HEADER_TEMPLATE,
      },
    });
  }
}
