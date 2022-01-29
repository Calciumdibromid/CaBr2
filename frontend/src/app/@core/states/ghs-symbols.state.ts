import { Action, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { translate } from '@ngneat/transloco';

import { AlertService } from '../services/alertsnackbar/altersnackbar.service';
import { IConfigService } from '../services/config/config.interface';
import Logger from '../utils/logger';

const logger = new Logger('ghs.symbols.state');

export type GHSSymbolMap = Map<string, SafeResourceUrl>;

export type SymbolKeys = string[];

export interface GHSSymbolsModel {
  symbols: GHSSymbolMap;
  symbolKeys: SymbolKeys;
}

export class LoadGHSSymbols {
  static readonly type = '[GHSSymbol] load GHS Symbols';
}

@State<GHSSymbolsModel>({
  name: 'ghs_symbols',
  defaults: {
    symbols: new Map(),
    symbolKeys: [],
  },
})
@Injectable()
export class GHSSymbolState {
  constructor(private configService: IConfigService, private alertService: AlertService) {}

  @Action(LoadGHSSymbols)
  loadGHSSymbols(context: StateContext<GHSSymbolsModel>): void {
    this.configService.getHazardSymbols().subscribe({
      next: (symbols) => {
        const symbolKeys = Array.from(symbols.keys());
        symbolKeys.sort();
        context.setState({
          symbols,
          symbolKeys,
        });
      },
      error: (err) => {
        logger.error('loading ghs-symbols failed:', err);
        this.alertService.error(translate('error.getHazardSymbols'));
      },
    });
  }
}
