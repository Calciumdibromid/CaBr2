import { Action, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { StringListStateModel } from '../interfaces/string-list-state-model.interface';

import { addEmptySentence, rearrangeSentences, removeSentence } from '../operators/string-list-operators';
import { AddSentence, RearrangeSentences, RemoveSentence, ResetSentences } from '../actions/rules-of-conduct-acitons';
import TEMPLATES from '../../../assets/docsTemplate.json';

const RULES_OF_CONDUCT_TEMPLATE = TEMPLATES.docsTemplate.rulesOfConduct;

@State<StringListStateModel>({
  name: 'rules_of_conduct_state',
  defaults: {
    form: {
      model: {
        elements: RULES_OF_CONDUCT_TEMPLATE.map((sentence) => ({ value: sentence })),
      },
    },
  },
})
@Injectable()
export class RulesOfConductState {
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
          elements: RULES_OF_CONDUCT_TEMPLATE.map((sentence) => ({ value: sentence })),
        },
      },
    });
  }
}
