import { CdkDragDrop } from '@angular/cdk/drag-drop';

export class AddSentence {
  static readonly type = '[InCaseOfDanger] add sentence';
}

export class RemoveSentence {
  static readonly type = '[InCaseOfDanger] remove sentence';

  constructor(public index: number) {}
}

export class RearrangeSentences {
  static readonly type = '[InCaseOfDanger] rearrange sentences';

  constructor(public event: CdkDragDrop<string[]> | any) {}
}

export class ResetSentences {
  static readonly type = '[InCaseOfDanger] reset sentences';
}
