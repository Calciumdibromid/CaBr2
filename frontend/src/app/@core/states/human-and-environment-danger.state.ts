import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';

import * as HumanAndEnvironmentDangerActions from '../actions/human-and-environment-danger.actions';
import { addEmptySentence, rearrangeSentences, removeSentence } from '../operators/string-list-operators';
import { GenericSentenceState } from './generic.state';
import { StringListStateModel } from '../interfaces/string-list-state-model.interface';
import TEMPLATES from '../../../assets/docsTemplate.json';

const HUMAN_AND_ENVIRONMENT_DANGER_TEMPLATE = TEMPLATES.docsTemplate.humanAndEnvironmentDanger;

@State<StringListStateModel>({
  name: 'human_and_environment_danger',
  defaults: {
    form: {
      model: {
        elements: HUMAN_AND_ENVIRONMENT_DANGER_TEMPLATE.map((sentence) => ({ value: sentence })),
      },
    },
  },
})
@Injectable()
export class HumanAndEnvironmentDangerState extends GenericSentenceState<HumanAndEnvironmentDangerActions.FillSentence> {
  @Selector()
  static elements(state: StringListStateModel): string[] {
    return super.elements(state);
  }

  @Action(HumanAndEnvironmentDangerActions.FillSentence)
  fillSentence(
    context: StateContext<StringListStateModel>,
    action: HumanAndEnvironmentDangerActions.FillSentence,
  ): void {
    super.fillSentence(context, action);
  }

  @Action(HumanAndEnvironmentDangerActions.AddSentence)
  addSentence(context: StateContext<StringListStateModel>): void {
    context.setState(addEmptySentence());
  }

  @Action(HumanAndEnvironmentDangerActions.RemoveSentence)
  removeSentence(
    context: StateContext<StringListStateModel>,
    action: HumanAndEnvironmentDangerActions.RemoveSentence,
  ): void {
    context.setState(removeSentence(action.index));
  }

  @Action(HumanAndEnvironmentDangerActions.RearrangeSentences)
  rearrangeSentences(
    context: StateContext<StringListStateModel>,
    action: HumanAndEnvironmentDangerActions.RearrangeSentences,
  ): void {
    context.setState(rearrangeSentences(action.event));
  }

  @Action(HumanAndEnvironmentDangerActions.ResetSentences)
  resetSentences(context: StateContext<StringListStateModel>): void {
    super.resetSentences(context, HUMAN_AND_ENVIRONMENT_DANGER_TEMPLATE);
  }
}
