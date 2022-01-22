import { Component } from '@angular/core';
import { StringListDispatcherActionMatpping as StringListDispatcherActionMapping } from 'src/app/@core/interfaces/string-list-state-model.interface';

import * as Disposal from '../../@core/actions/disposal.actions';
import * as HumanAndEnvironmentDanger from '../../@core/actions/human-and-environment-danger.actions';
import * as InCaseOfDanger from '../../@core/actions/in-case-of-danger.actions';
import * as RulesOfConduct from '../../@core/actions/rules-of-conduct-acitons';
import { GlobalModel } from 'src/app/@core/models/global.model';

@Component({
  selector: 'app-security-things',
  templateUrl: './security-things.component.html',
  styleUrls: ['./security-things.component.scss'],
})
export class SecurityThingsComponent {
  humanAndEnvimiromentActions: StringListDispatcherActionMapping = {
    addSentence: HumanAndEnvironmentDanger.AddSentence,
    removeSentence: HumanAndEnvironmentDanger.RemoveSentence,
    rearrangeSentence: HumanAndEnvironmentDanger.RearrangeSentences,
  };

  rulesOfConductActions: StringListDispatcherActionMapping = {
    addSentence: RulesOfConduct.AddSentence,
    removeSentence: RulesOfConduct.RemoveSentence,
    rearrangeSentence: RulesOfConduct.RearrangeSentences,
  };

  inCaseOfDangerActions: StringListDispatcherActionMapping = {
    addSentence: InCaseOfDanger.AddSentence,
    removeSentence: InCaseOfDanger.RemoveSentence,
    rearrangeSentence: InCaseOfDanger.RearrangeSentences,
  };

  disposalActions: StringListDispatcherActionMapping = {
    addSentence: Disposal.AddSentence,
    removeSentence: Disposal.RemoveSentence,
    rearrangeSentence: Disposal.RearrangeSentences,
  };

  constructor(public globals: GlobalModel) {}
}
