export interface Config {
  readonly darkTheme: boolean;
  readonly language: string;
  readonly acceptedConsent: boolean;
}

export enum ConfigState {
  INITIAL,
  LOADED,
  CHANGED,
}
