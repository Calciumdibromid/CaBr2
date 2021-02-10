import { Header } from '../../interfaces/Header';
import { SubstanceData } from '../substances/substances.model';

export interface CaBr2Document {
  header: Header;
  substanceData: SubstanceData[];
  humanAndEnvironmentDanger: string[];
  rulesOfConduct: string[];
  inCaseOfDanger: string[];
  disposal: string[];
}
