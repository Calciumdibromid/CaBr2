import { CdkDragDrop } from '@angular/cdk/drag-drop';

export class FillSentence {
  static readonly type = '[RulesOfConduct] fill sentence';

  constructor(public strings: string[]) {}
}

export class AddEmptyLine {
  static readonly type = '[RulesOfConduct] add empty line';
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
