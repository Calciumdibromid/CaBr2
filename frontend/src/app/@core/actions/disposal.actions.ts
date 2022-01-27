import { CdkDragDrop } from '@angular/cdk/drag-drop';

export class FillSentence {
  static readonly type = '[Disposal] fill sentence';

  constructor(public strings: string[]) {}
}

export class AddSentence {
  static readonly type = '[Disposal] add sentence';
}

export class RemoveSentence {
  static readonly type = '[Disposal] remove sentence';

  constructor(public index: number) {}
}

export class RearrangeSentences {
  static readonly type = '[Disposal] rearrange sentences';

  constructor(public event: CdkDragDrop<string[]> | any) {}
}

export class ResetSentences {
  static readonly type = '[Disposal] reset sentences';
}
