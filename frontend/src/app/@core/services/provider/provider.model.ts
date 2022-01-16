export type SearchType = 'chemicalName' | 'chemicalFormula' | 'numbers' | 'fullText';
export const searchTypes: SearchType[] = ['chemicalName', 'chemicalFormula', 'numbers', 'fullText'];

export interface SearchTypeMapping {
  viewValue: string;
  value: SearchType;
}

export interface SearchArgument {
  searchType: SearchType;
  pattern: string;
}

export interface SearchArguments {
  arguments: SearchArgument[];
  exact?: boolean;
}

export interface SearchResult {
  zvgNumber: string;
  casNumber: string;
  name: string;
}

export interface Provider {
  name: string;
  identifier: string;
}

export type ProviderMapping = Map<string, Provider>;
