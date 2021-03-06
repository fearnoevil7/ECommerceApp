import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string, fieldName: string): any[] {
    if (!items) { return []; }

    if (!searchText) { return items; }

    searchText = searchText.toUpperCase();

    return items.filter(item => {
      if (item && item[fieldName]) {
        return item[fieldName].toUpperCase().includes(searchText);
      }
      return false;
    })
  }

}