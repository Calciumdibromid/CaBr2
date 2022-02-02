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

export const stateToElements = (store: Store, stateName: string): Observable<ElementModel[] | undefined> =>
  store.selectOnce(
    (state) =>
      Object.entries<StringListStateModel>(state).find((entry) => entry[0] === stateName)?.[1].form.model?.elements,
  );
