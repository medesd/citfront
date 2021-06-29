import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return value ? value.replace(/_/g, ' ') : value;
  }

}
