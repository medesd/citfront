import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'null'
})
export class NullPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    if (value.trim() === '' || value.trim() === null) {
      return '-';
    }
  }

}
