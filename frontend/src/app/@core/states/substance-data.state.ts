import { Action, Selector, State, StateContext } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { translate } from '@ngneat/transloco';

import { Data, EMPTY_VIEW_SUBSTANCE_DATA, SubstanceData, ViewSubstanceData } from '../models/substances.model';
import { AlertService } from '../services/alertsnackbar/alertsnackbar.service';
import { IProviderService } from '../services/provider/provider.interface';
import Logger from '../utils/logger';
import { ProviderMapping } from '../services/provider/provider.model';

const logger = new Logger('substance.data.state');

interface SubstanceDataStateModel {
  substanceData: SubstanceData[];
  providers: Set<string>;
}

export class FillSubstanceData {
  static readonly type = '[SubstanceData] fill data with payload';

  constructor(public substanceData: SubstanceData[]) {}
}

export class AddSubstanceData {
  static readonly type = '[SubstanceData] add data';

  constructor(public substanceData: SubstanceData) {}
}

export class RemoveSubstanceData {
  static readonly type = '[SubstanceData] remove data';

  constructor(public dataToRemove: SubstanceData) {}
}

export class ModifySubstanceData {
  static readonly type = '[SubstanceData] modify data';

  constructor(public origData: SubstanceData, public modifiedData: SubstanceData) {}
}

export class RearrangeSubstanceData {
  static readonly type = '[SubstanceData] rearrange data';

  constructor(public event: CdkDragDrop<string[]> | any) {}
}

export class ClearAllSubstanceData {
  static readonly type = '[SubstanceData] clear all substance data';
}

@State<SubstanceDataStateModel>({
  name: 'substance_data',
  defaults: {
    substanceData: [],
    providers: new Set(),
  },
})
@Injectable()
export class SubstanceDataState {
  private providerMapping!: ProviderMapping;

  constructor(private alertService: AlertService, private providerService: IProviderService) {
    this.providerService.providerMappingsObservable.subscribe((providers) => (this.providerMapping = providers));
  }

  @Selector()
  static viewSubstanceData(state: SubstanceDataStateModel): ViewSubstanceData[] {
    const substanceData = state.substanceData;
    const viewData = substanceData.map((value) => value.convertToViewSubstanceData());

    // to prefill or fill up at least 5 substance data rows
    for (let i = viewData.length; i < 5; i++) {
      viewData.push(EMPTY_VIEW_SUBSTANCE_DATA);
    }

    return viewData;
  }

  @Action(FillSubstanceData)
  fillSubstanceData(context: StateContext<SubstanceDataStateModel>, action: FillSubstanceData): void {
    const providers = new Set<string>();
    const substanceData = action.substanceData.map((data) => new SubstanceData(data));

    substanceData.forEach((data) => this.setProviders(providers, data));

    context.setState({
      substanceData,
      providers,
    });
  }

  @Action(AddSubstanceData)
  addSubstanceData(context: StateContext<SubstanceDataStateModel>, action: AddSubstanceData): void {
    const substanceState = context.getState().substanceData;
    const providers = new Set(context.getState().providers);
    const cas = this.modifiedOrOriginal(action.substanceData.cas);
    if (cas && substanceState.some((s) => cas === this.modifiedOrOriginal(s.cas))) {
      logger.warning('substance with same cas number already present:', cas);
      this.alertService.error(translate('error.substanceWithCASExist'));
      return;
    }

    this.setProviders(providers, action.substanceData);

    context.setState(
      patch({
        substanceData: append([action.substanceData]),
        providers,
      }),
    );
  }

  @Action(RemoveSubstanceData)
  removeSubstanceData(context: StateContext<SubstanceDataStateModel>, action: RemoveSubstanceData): void {
    const index = context.getState().substanceData.indexOf(action.dataToRemove);
    context.setState(
      patch({
        substanceData: removeItem(index),
      }),
    );
  }

  @Action(ModifySubstanceData)
  modifySubstanceData(context: StateContext<SubstanceDataStateModel>, action: ModifySubstanceData): void {
    const index = context.getState().substanceData.indexOf(action.origData);
    action.modifiedData.checked = true;
    context.setState(
      patch({
        substanceData: updateItem(index, action.modifiedData),
      }),
    );
  }

  @Action(RearrangeSubstanceData)
  rearrangeSubstanceData(context: StateContext<SubstanceDataStateModel>, action: RearrangeSubstanceData): void {
    const state = context.getState().substanceData.slice();
    moveItemInArray(state, action.event.previousIndex, action.event.currentIndex);
    context.patchState({
      substanceData: state,
    });
  }

  @Action(ClearAllSubstanceData)
  clearAllSubstanceData(context: StateContext<SubstanceDataStateModel>): void {
    context.setState({
      substanceData: [],
      providers: new Set(),
    });
  }

  private modifiedOrOriginal<T>(obj: Data<T>): T {
    return obj.modifiedData ?? obj.originalData;
  }

  private setProviders(providers: Set<string>, data: SubstanceData): void {
    const provider = this.providerMapping.get(data.source.provider);
    if (provider && provider.identifier !== 'custom') {
      providers.add(provider.name);
    }
  }
}
