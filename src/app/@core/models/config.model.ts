import { Injectable } from '@angular/core';

@Injectable()
export class ConfigModel {
  global: Global = {
    darkTheme: false,
  };

  setConfig(newConfig: ConfigModel) {
    this.global = newConfig.global;
  }
}

export interface Global {
  darkTheme: boolean;
}
