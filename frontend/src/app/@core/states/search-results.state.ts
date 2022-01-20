import { Action, State, StateContext } from '@ngxs/store';
import { append, removeItem, updateItem } from '@ngxs/store/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { translate } from '@ngneat/transloco';

import { Data, SubstanceData } from '../models/substances.model';
import { AlertService } from '../services/alertsnackbar/altersnackbar.service';
import Logger from '../utils/logger';

const logger = new Logger('substance.data.state');

export class AddSubstanceData {
  static readonly type = '[SubstanceData] add substance data';

  constructor(public substanceData: SubstanceData) {}
}

export class RemoveSubstanceData {
  static readonly type = '[SubstanceData] remove substance data';

  constructor(public dataToRemove: SubstanceData) {}
}

export class ModifySubstanceData {
  static readonly type = '[SubstanceData] modify substance data';

  constructor(public origData: SubstanceData, public modifiedData: SubstanceData) {}
}

export class RearrangeSubstanceData {
  static readonly type = '[SubstanceData] rearrange substance data';

  constructor(public event: CdkDragDrop<string[]> | any) {}
}

@State<SubstanceData[]>({
  name: 'search_results',
  defaults: [],
})
@Injectable()
export class SubstanceDataState {
  constructor(private alertService: AlertService) {}

  @Action(AddSubstanceData)
  addSubstanceData(context: StateContext<SubstanceData[]>, action: AddSubstanceData): void {
    const state = context.getState();
    const cas = this.modifiedOrOriginal(action.substanceData.cas);
    if (cas && state.some((s) => cas === this.modifiedOrOriginal(s.cas))) {
      logger.warning('substance with same cas number already present:', cas);
      this.alertService.error(translate('error.substanceWithCASExist'));
      return;
    }

    context.setState(append([action.substanceData]));
  }

  @Action(RemoveSubstanceData)
  removeSubstanceData(context: StateContext<SubstanceData[]>, action: RemoveSubstanceData): void {
    const index = context.getState().indexOf(action.dataToRemove);
    context.setState(removeItem(index));
  }

  @Action(ModifySubstanceData)
  modifySubstanceData(context: StateContext<SubstanceData[]>, action: ModifySubstanceData): void {
    const index = context.getState().indexOf(action.origData);
    action.modifiedData.checked = true;
    context.setState(updateItem(index, action.modifiedData));
  }

  @Action(RearrangeSubstanceData)
  rearrangeSubstanceData(context: StateContext<SubstanceData[]>, action: RearrangeSubstanceData): void {
    const state = context.getState().slice();
    moveItemInArray(state, action.event.previousIndex, action.event.currentIndex);
    context.setState(state);
  }

  private modifiedOrOriginal<T>(obj: Data<T>): T {
    return obj.modifiedData ?? obj.originalData;
  }
}
