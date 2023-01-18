import { FormArray, FormControl } from '@angular/forms';

export type StringListForm = {
  elements: FormArray<FormControl<string>>;
};
