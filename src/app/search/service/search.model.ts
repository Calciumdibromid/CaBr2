export type SearchType = 'chemicalName' | 'empiricalFormula' | 'numbers' | 'fullText';

export interface SearchArgument {
  searchType: SearchType,
  pattern: String,
}

export interface SearchResult {
  zvgNumber: string,
  casNumber: string,
  name: string,
}
