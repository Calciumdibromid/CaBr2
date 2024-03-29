import { DialogFilter } from '../native/tauri.service';
import { Header } from '../../interfaces/DocTemplate';
import { SubstanceData } from '../../models/substances.model';

export interface CaBr2Document {
  header: Header;
  substanceData: SubstanceData[];
  humanAndEnvironmentDanger: string[];
  rulesOfConduct: string[];
  inCaseOfDanger: string[];
  disposal: string[];
}

export interface DocumentTypes {
  load: DialogFilter[];
  save: DialogFilter[];
}
