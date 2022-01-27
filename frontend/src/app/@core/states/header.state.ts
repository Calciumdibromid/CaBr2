import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';

import { Header } from '../interfaces/DocTemplate';
import TEMPLATES from '../../../assets/docsTemplate.json';

const HEADER_TEMPLATE = TEMPLATES.docsTemplate.header;

interface HeaderStateModel {
  headerForm: {
    model?: Header;
  };
}

const EMPTY_HEADER: Header = {
  assistant: '',
  documentTitle: '',
  labCourse: '',
  name: '',
  organization: '',
  place: '',
  preparation: '',
};

export class FillHeader {
  static readonly type = '[Header] fill header with new values';

  constructor(public header: Header) {}
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
  @Selector()
  static header(state: HeaderStateModel): Header {
    return state.headerForm.model ?? EMPTY_HEADER;
  }

  @Action(FillHeader)
  fillHeader(context: StateContext<HeaderStateModel>, action: FillHeader): void {
    context.setState({
      headerForm: {
        model: action.header,
      },
    });
  }

  @Action(ResetHeader)
  resetHeader(context: StateContext<HeaderStateModel>): void {
    context.setState({
      headerForm: {
        model: HEADER_TEMPLATE,
      },
    });
  }
}
