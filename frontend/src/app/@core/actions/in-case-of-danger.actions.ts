import { CdkDragDrop } from '@angular/cdk/drag-drop';

export class AddSentence {
  static readonly type = '[RulesOfConduct] add sentence';
}

export class RemoveSentence {
  static readonly type = '[RulesOfConduct] remove sentence';

  constructor(public index: number) {}
}

export class RearrangeSentences {
  static readonly type = '[RulesOfConduct] rearrange sentences';

  constructor(public event: CdkDragDrop<string[]> | any) {}
}

export class ResetSentences {
  static readonly type = '[RulesOfConduct] reset sentences';
}
