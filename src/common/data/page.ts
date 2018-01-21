
import {HttpParams} from '@angular/common/http';
import {Sort} from './sort';

export class Page<T>{

  public content: T[];
  public totalElements: number;
  public totalPages: number;
  public last: boolean;
  public size: number;
  public number: number;
  public sort: any;
  public first: boolean;
  public numberOfElements: number;


  public static from<TS>(data: TS[]) {
    let page = new Page<TS>();
    page.content = data;
    page.totalElements = data.length;
    page.totalPages = 1;
    page.last = true;
    page.first = true;
    page.size = data.length;
    page.number = 0;
    page.numberOfElements = data.length;
    return page;
  }
}

export class Pageable {

  public readonly page: number;
  public readonly size: number;
  public readonly sorts: Sort[] = [];

  constructor(
    page: number,
    size: number,
    sorts?: Sort[]) {

    this.page = page;
    this.size = size;
    this.sorts = sorts ? sorts : [];
  }
}


export class PageableUtil {
    public static addPageQueryParams(params: HttpParams, pageable: Pageable): HttpParams {
        params = params.set('page', pageable.page.toString());
        params = params.set('size', pageable.size.toString());
        for (let sort of pageable.sorts){
            params = params.append('sort', sort.prop + ',' + sort.dir);
        }
        return params;
    }
}
