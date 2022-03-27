import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { StringListStateModel } from '../interfaces/string-list-state-model.interface';

import * as RulesOfConductActions from '../actions/rules-of-conduct-acitons';
import { addEmptySentence, rearrangeSentences, removeSentence } from '../operators/string-list-operators';
import { GenericSentenceState } from './@generic.state';
import TEMPLATES from '../../../assets/docsTemplate.json';

const RULES_OF_CONDUCT_TEMPLATE = TEMPLATES.docsTemplate.rulesOfConduct;

@State<StringListStateModel>({
  name: 'rules_of_conduct_state',
  defaults: {
    form: {
      model: {
        elements: RULES_OF_CONDUCT_TEMPLATE,
      },
    },
  },
})
@Injectable()
export class RulesOfConductState extends GenericSentenceState<RulesOfConductActions.FillSentence> {
  @Selector()
  static elements(state: StringListStateModel): string[] {
    return super.elements(state);
  }

  @Action(RulesOfConductActions.FillSentence)
  fillSentence(context: StateContext<StringListStateModel>, action: RulesOfConductActions.FillSentence): void {
    super.fillSentence(context, action);
  }

  @Action(RulesOfConductActions.AddEmptyLine)
  addSentence(context: StateContext<StringListStateModel>): void {
    context.setState(addEmptySentence());
  }

  @Action(RulesOfConductActions.RemoveSentence)
  removeSentence(context: StateContext<StringListStateModel>, action: RulesOfConductActions.RemoveSentence): void {
    context.setState(removeSentence(action.index));
  }

  @Action(RulesOfConductActions.RearrangeSentences)
  rearrangeSentences(
    context: StateContext<StringListStateModel>,
    action: RulesOfConductActions.RearrangeSentences,
  ): void {
    context.setState(rearrangeSentences(action.event));
  }

  @Action(RulesOfConductActions.ResetSentences)
  resetSentences(context: StateContext<StringListStateModel>): void {
    super.resetSentences(context, RULES_OF_CONDUCT_TEMPLATE);
  }
}
