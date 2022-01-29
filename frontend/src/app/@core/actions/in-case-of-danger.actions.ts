import { CdkDragDrop } from '@angular/cdk/drag-drop';

export class FillSentence {
  static readonly type = '[InCaseOfDanger] fill sentence';

  constructor(public strings: string[]) {}
}

export class AddLine {
  static readonly type = '[InCaseOfDanger] add line';
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
