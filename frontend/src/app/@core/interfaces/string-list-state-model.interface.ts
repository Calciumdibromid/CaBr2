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
