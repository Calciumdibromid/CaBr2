import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';

import { ElementModel, StringListStateModel } from '../interfaces/string-list-state-model.interface';

export const initForm = (value: string, formBuilder: FormBuilder): FormGroup =>
  formBuilder.group({
    value,
  });

export const elementsToFormGroup = (formBuilder: FormBuilder, elements?: ElementModel[]): FormGroup =>
  formBuilder.group({
    elements: formBuilder.array(elements?.map((element) => initForm(element.value, formBuilder)) ?? []),
  });

// if you think there is a better way, feel free to improve this piece of code
export const stateToElements = (store: Store, identifier: string): Observable<ElementModel[] | undefined> =>
  store.selectOnce(
    (state) =>
      Object.entries<StringListStateModel>(state)
        .filter((entry) => entry[0] === identifier)
        .map((entry) => entry[1])
        .map((value) => value.form.model?.elements)[0],
  );
