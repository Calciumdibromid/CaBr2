import { StateContext } from '@ngxs/store';

import { StringListStateModel } from '../interfaces/string-list-state-model.interface';

class FillSentence {
  constructor(public strings: string[]) {}
}

export abstract class GenericSentenceState<FILL extends FillSentence> {
  static elements(state: StringListStateModel): string[] {
    return state.form.model?.elements ?? [];
  }

  fillSentence(context: StateContext<StringListStateModel>, action: FILL): void {
    context.setState({
      form: {
        model: {
          elements: action.strings,
        },
      },
    });
  }

  resetSentences(context: StateContext<StringListStateModel>, elements: string[]): void {
    context.setState({
      form: {
        model: {
          elements,
        },
      },
    });
  }
}
