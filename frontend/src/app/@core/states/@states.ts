import { ConfigState } from './config.state';
import { DisposalState } from './disposal.state';
import { GHSSymbolState } from './ghs-symbols.state';
import { HeaderState } from './header.state';
import { HumanAndEnvironmentDangerState } from './human-and-environment-danger.state';
import { InCaseOfDangerState } from './incase-of-danger.state';
import { RulesOfConductState } from './rules-of-conduct.state';
import { SubstanceDataState } from './substance-data.state';

const States = [
  HeaderState,
  GHSSymbolState,
  SubstanceDataState,
  HumanAndEnvironmentDangerState,
  RulesOfConductState,
  InCaseOfDangerState,
  DisposalState,
  ConfigState,
];

export default States;
