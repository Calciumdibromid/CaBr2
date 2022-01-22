import { CdkDragDrop } from '@angular/cdk/drag-drop';

export class AddSentence {
  static readonly type = '[HumanAndEnvironmentDanger] add sentence';
}

export class RemoveSentence {
  static readonly type = '[HumanAndEnvironmentDanger] remove sentence';

  constructor(public index: number) {}
}

export class RearrangeSentences {
  static readonly type = '[HumanAndEnvironmentDanger] rearrange sentences';

  constructor(public event: CdkDragDrop<string[]> | any) {}
}

export class ResetSentences {
  static readonly type = '[HumanAndEnvironmentDanger] reset sentences';
}
