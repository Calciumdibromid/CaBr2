import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';

import * as DisposalActions from '../actions/disposal.actions';
import { addEmptySentence, rearrangeSentences, removeSentence } from '../operators/string-list-operators';
import { GenericSentenceState } from './@generic.state';
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
export class DisposalState extends GenericSentenceState<DisposalActions.FillSentence> {
  @Selector()
  static elements(state: StringListStateModel): string[] {
    return super.elements(state);
  }

  @Action(DisposalActions.FillSentence)
  fillSentence(context: StateContext<StringListStateModel>, action: DisposalActions.FillSentence): void {
    super.fillSentence(context, action);
  }

  @Action(DisposalActions.AddEmptyLine)
  addSentence(context: StateContext<StringListStateModel>): void {
    context.setState(addEmptySentence());
  }

  @Action(DisposalActions.RemoveSentence)
  removeSentence(context: StateContext<StringListStateModel>, action: DisposalActions.RemoveSentence): void {
    context.setState(removeSentence(action.index));
  }

  @Action(DisposalActions.RearrangeSentences)
  rearrangeSentences(context: StateContext<StringListStateModel>, action: DisposalActions.RearrangeSentences): void {
    context.setState(rearrangeSentences(action.event));
  }

  @Action(DisposalActions.ResetSentences)
  resetSentences(context: StateContext<StringListStateModel>): void {
    super.resetSentences(context, DISPOSAL_TEMPLATE);
  }
}
