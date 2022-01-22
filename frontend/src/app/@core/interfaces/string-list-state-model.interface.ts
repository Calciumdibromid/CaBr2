import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FormGroup } from '@angular/forms';

import { ActionNewable } from '../utils/action-newable';

export interface StringListStateModel {
  form: {
    model?: {
      elements: ElementModel[];
    };
  };
}

export interface ElementModel {
  value: string;
}

export interface StringListDispatcherActionMatpping {
  // TODO find a way to replace any with type (it's weird that ActionType does not work)
  addSentence: ActionNewable<any>;
  removeSentence: ActionNewable<any, number>;
  rearrangeSentence: ActionNewable<any, CdkDragDrop<FormGroup[]>>;
}
