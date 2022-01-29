import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';

import * as InCaseOfDangerActions from '../actions/in-case-of-danger.actions';
import { addEmptySentence, rearrangeSentences, removeSentence } from '../operators/string-list-operators';
import { GenericSentenceState } from './@generic.state';
import { StringListStateModel } from '../interfaces/string-list-state-model.interface';
import TEMPLATES from '../../../assets/docsTemplate.json';

const IN_CASE_OF_DANGER_TEMPLATE = TEMPLATES.docsTemplate.inCaseOfDanger;

@State<StringListStateModel>({
  name: 'in_case_of_danger',
  defaults: {
    form: {
      model: {
        elements: IN_CASE_OF_DANGER_TEMPLATE.map((sentence) => ({ value: sentence })),
      },
    },
  },
})
@Injectable()
export class InCaseOfDangerState extends GenericSentenceState<InCaseOfDangerActions.FillSentence> {
  @Selector()
  static elements(state: StringListStateModel): string[] {
    return super.elements(state);
  }

  @Action(InCaseOfDangerActions.FillSentence)
  fillSentence(context: StateContext<StringListStateModel>, action: InCaseOfDangerActions.FillSentence): void {
    super.fillSentence(context, action);
  }

  @Action(InCaseOfDangerActions.AddEmptyLine)
  addSentence(context: StateContext<StringListStateModel>): void {
    context.setState(addEmptySentence());
  }

  @Action(InCaseOfDangerActions.RemoveSentence)
  removeSentence(context: StateContext<StringListStateModel>, action: InCaseOfDangerActions.RemoveSentence): void {
    context.setState(removeSentence(action.index));
  }

  @Action(InCaseOfDangerActions.RearrangeSentences)
  rearrangeSentences(
    context: StateContext<StringListStateModel>,
    action: InCaseOfDangerActions.RearrangeSentences,
  ): void {
    context.setState(rearrangeSentences(action.event));
  }

  @Action(InCaseOfDangerActions.ResetSentences)
  resetSentences(context: StateContext<StringListStateModel>): void {
    super.resetSentences(context, IN_CASE_OF_DANGER_TEMPLATE);
  }
}
