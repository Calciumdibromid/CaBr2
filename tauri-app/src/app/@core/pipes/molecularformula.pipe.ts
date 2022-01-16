import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'subMolecularFormula' })
export class SubMolecularFormula implements PipeTransform {
  transform(value: string | undefined): string | undefined {
    return value?.replace(/(\d+)/g, '<sub>$1</sub>');
  }
}
