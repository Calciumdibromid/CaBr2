export interface Header {
  assistant: string;
  documentTitle: string;
  labCourse: string;
  name: string;
  organization: string;
  place: string;
  preparation: string;
}

export default interface DocsTemplate {
  header: Header;
  humanAndEnvironmentDanger: string[];
  rulesOfConduct: string[];
  inCaseOfDanger: string[];
  disposal: string[];
}
