import { DisposalState } from './disposal.state';
import { GHSSYmbolState } from './ghs-symbols.state';
import { HeaderState } from './header.state';
import { HumanAndEnvironmentDangerState } from './human-and-environment-danger.state';
import { InCaseOfDangerState } from './incase-of-danger.state';
import { RulesOfConductState } from './rules-of-conduct.state';
import { SubstanceDataState } from './substance-data.state';

const States = [
  HeaderState,
  GHSSYmbolState,
  SubstanceDataState,
  HumanAndEnvironmentDangerState,
  RulesOfConductState,
  InCaseOfDangerState,
  DisposalState,
];

export default States;
