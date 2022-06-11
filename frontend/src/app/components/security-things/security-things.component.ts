import { Actions, Store } from '@ngxs/store';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

import * as Disposal from '../../@core/actions/disposal.actions';
import * as HumanAndEnvironmentDanger from '../../@core/actions/human-and-environment-danger.actions';
import * as InCaseOfDanger from '../../@core/actions/in-case-of-danger.actions';
import * as RulesOfConduct from '../../@core/actions/rules-of-conduct-acitons';
import { ActionNewable } from 'src/app/@core/utils/action-newable';

@Component({
  selector: 'app-security-things',
  templateUrl: './security-things.component.html',
  styleUrls: ['./security-things.component.scss'],
})
export class SecurityThingsComponent {
  HumanAndEnvironmentDanger = HumanAndEnvironmentDanger;

  RulesOfConduct = RulesOfConduct;

  InCaseOfDanger = InCaseOfDanger;

  Disposal = Disposal;

  constructor(private store: Store, private formBuilder: UntypedFormBuilder, private actions$: Actions) {}

  add(action: ActionNewable<unknown>): void {
    this.store.dispatch(new action());
  }

  remove(action: ActionNewable<any, number>, index: number): void {
    this.store.dispatch(new action(index));
  }

  rearrange(action: ActionNewable<any, CdkDragDrop<UntypedFormGroup[]>>, event: CdkDragDrop<UntypedFormGroup[]>): void {
    this.store.dispatch(new action(event));
  }
}
