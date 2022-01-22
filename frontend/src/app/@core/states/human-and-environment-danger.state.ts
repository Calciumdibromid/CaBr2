import { Action, State, StateContext } from '@ngxs/store';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';

import { addEmptySentence, rearrangeSentences, removeSentence } from '../operators/string-list-operators';
import { StringListStateModel } from '../interfaces/string-list-state-model.interface';
import TEMPLATES from '../../../assets/docsTemplate.json';

const HUMAN_AND_ENVIRONMENT_DANGER_TEMPLATE = TEMPLATES.docsTemplate.humanAndEnvironmentDanger;

export class AddSentence {
  static readonly type = '[HumanAndEnvironmentDanger] add sentence';
}

export class RemoveSentence {
  static readonly type = '[HumanAndEnvironmentDanger] remove sentence';

  constructor(public index: number) {}
}

export class RearrangeSentences {
  static readonly type = '[HumanAndEnvironmentDanger] rearrange sentences';

  constructor(public event: CdkDragDrop<string[]> | any) {}
}

export class ResetSentences {
  static readonly type = '[HumanAndEnvironmentDanger] reset sentences';
}

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
export class HumanAndEnvironmentDangerState {
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
          elements: HUMAN_AND_ENVIRONMENT_DANGER_TEMPLATE.map((sentence) => ({ value: sentence })),
        },
      },
    });
  }
}
