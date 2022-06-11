import { AbstractControl, UntypedFormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';

import { StringListStateModel } from '../interfaces/string-list-state-model.interface';

export const stateToElements = (store: Store, stateName: string): Observable<string[] | undefined> =>
  store.selectOnce(
    (state) =>
      Object.entries<StringListStateModel>(state).find((entry) => entry[0] === stateName)?.[1].form.model?.elements,
  );

/**
 * Fix number of controls in a `FormArray`. Use this before a `patchValue` call.
 *
 * Add controls when too small, delete controls when too large.
 */
// https://youtu.be/-AQfQFcXac8
export const fixNumberOfControls = (
  control: UntypedFormArray,
  needed: number,
  current: number,
  newCallback: () => AbstractControl,
): void => {
  let diff = needed - current;
  if (diff > 0) {
    for (; diff > 0; diff--) {
      control.push(newCallback());
    }
  } else if (diff < 0) {
    for (; diff < 0; diff++) {
      control.removeAt(0);
    }
  }
};
