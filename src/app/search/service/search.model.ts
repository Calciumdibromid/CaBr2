export type SearchType = 'chemicalName' | 'empiricalFormula' | 'numbers' | 'fullText';

export interface SearchArgument {
  searchType: SearchType,
  pattern: String,
}

export interface SearchArguments {
  arguments: SearchArgument[],
  exact?: boolean,
}

export interface SearchResult {
  zvgNumber: string,
  casNumber: string,
  name: string,
}
