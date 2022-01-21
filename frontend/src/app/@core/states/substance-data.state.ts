import { Action, Select, State, StateContext } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { translate } from '@ngneat/transloco';

import { Data, SubstanceData, ViewSubstanceData } from '../models/substances.model';
import { AlertService } from '../services/alertsnackbar/altersnackbar.service';
import { IProviderService } from '../services/provider/provider.interface';
import Logger from '../utils/logger';
import { ProviderMapping } from '../services/provider/provider.model';

const logger = new Logger('substance.data.state');

interface SubstanceDataStateModel {
  substanceData: SubstanceData[];
  providers: Set<string>;
}

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

  @Select()
  static viewSubstanceData(state: any): ViewSubstanceData[] {
    const substanceData: SubstanceData[] = state.substance_data.substanceData;

    const viewData = substanceData.map<ViewSubstanceData>((value) => ({
      name: value.name.modifiedData ?? value.name.originalData,
      cas: value.cas.modifiedData ?? value.cas.originalData,
      molecularFormula: value.molecularFormula.modifiedData ?? value.molecularFormula.originalData,
      molarMass: value.molarMass.modifiedData ?? value.molarMass.originalData,
      meltingPoint: value.meltingPoint.modifiedData ?? value.meltingPoint.originalData,
      boilingPoint: value.boilingPoint.modifiedData ?? value.boilingPoint.originalData,
      waterHazardClass: value.waterHazardClass.modifiedData ?? value.waterHazardClass.originalData,
      hPhrases: value.hPhrases.modifiedData ?? value.hPhrases.originalData,
      pPhrases: value.pPhrases.modifiedData ?? value.pPhrases.originalData,
      signalWord: value.signalWord.modifiedData ?? value.signalWord.originalData,
      symbols: value.symbols.modifiedData ?? value.symbols.originalData,
      lethalDose: value.lethalDose.modifiedData ?? value.lethalDose.originalData,
      mak: value.mak.modifiedData ?? value.mak.originalData,
      amount: value.amount,
    }));

    for (let i = viewData.length; i < 5; i++) {
      viewData.push({
        name: '',
        cas: '',
        molecularFormula: '',
        molarMass: '',
        meltingPoint: '',
        boilingPoint: '',
        waterHazardClass: '',
        hPhrases: [],
        pPhrases: [],
        signalWord: '',
        symbols: [],
        lethalDose: '',
        mak: '',
      });
    }

    return viewData;
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
