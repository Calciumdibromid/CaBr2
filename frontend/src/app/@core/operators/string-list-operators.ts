import { append, patch, removeItem } from '@ngxs/store/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { StateOperator } from '@ngxs/store';

import { StringListStateModel } from '../interfaces/string-list-state-model.interface';

export const addEmptySentence = (): StateOperator<StringListStateModel> =>
  patch<StringListStateModel>({
    form: patch({
      model: patch({
        elements: append(['']),
      }),
    }),
  });

export const removeSentence = (index: number): StateOperator<StringListStateModel> =>
  patch<StringListStateModel>({
    form: patch({
      model: patch({
        elements: removeItem(index),
      }),
    }),
  });

export const rearrangeSentences =
  (event: CdkDragDrop<string[]> | any): StateOperator<StringListStateModel> =>
  (state: Readonly<StringListStateModel>): StringListStateModel => {
    const elements = state.form.model?.elements.slice();
    if (elements) {
      moveItemInArray(elements, event.previousIndex, event.currentIndex);
      return {
        ...state,
        form: {
          ...state.form,
          model: {
            ...state.form.model,
            elements,
          },
        },
      };
    }
    return state;
  };
