import { Action, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';

import { addEmptySentence, rearrangeSentences, removeSentence } from '../operators/string-list-operators';
import { AddSentence, RearrangeSentences, RemoveSentence, ResetSentences } from '../actions/disposal.actions';
import { StringListStateModel } from '../interfaces/string-list-state-model.interface';
import TEMPLATES from '../../../assets/docsTemplate.json';

const DISPOSAL_TEMPLATE = TEMPLATES.docsTemplate.disposal;

@State<StringListStateModel>({
  name: 'disposal',
  defaults: {
    form: {
      model: {
        elements: DISPOSAL_TEMPLATE.map((sentence) => ({ value: sentence })),
      },
    },
  },
})
@Injectable()
export class DisposalState {
  @Action(AddSentence)
  addSentence(context: StateContext<StringListStateModel>): void {
    context.setState(addEmptySentence());
  }

  @Action(RemoveSentence)
  removeSentence(context: StateContext<StringListStateModel>, action: RemoveSentence): void {
    context.setState(removeSentence(action.index));
  }

  @Action(RearrangeSentences)
  rearrangeSentences(context: StateContext<StringListStateModel>, action: RearrangeSentences): void {
    context.setState(rearrangeSentences(action.event));
  }

  @Action(ResetSentences)
  resetSentences(context: StateContext<StringListStateModel>): void {
    context.setState({
      form: {
        model: {
          elements: DISPOSAL_TEMPLATE.map((sentence) => ({ value: sentence })),
        },
      },
    });
  }
}
