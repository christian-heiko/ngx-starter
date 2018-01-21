import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {Sort} from '../../common/data/sort';



export class SortOption {
  constructor(
    public id: string,
    public name: string
  ) { }
}

/**
 * Represents the search query which the user has configured
 */
export class SearchQuery {

  public static Empty = new SearchQuery('', []);

  constructor(
    public keywords: string,
    public sorts: Sort[]
  ) { }
}

@Injectable()
export class GlobalSearchService {

  private _showGlobalSearch = false;
  private _showGlobalSearchSubject = new Subject<boolean>();

  private _query: SearchQuery;
  private _querySubject = new Subject<SearchQuery>();
  private _availableSorts = new Subject<SortOption[]>();


  constructor(router: Router) {

     router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => router.routerState.root)
      .map(route => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data)
      .subscribe(currentRouteData  => {
        let enableGlobalSearch = currentRouteData['enableGlobalSearch'];
        this.showGlobalSearch = enableGlobalSearch != null ? !!enableGlobalSearch : !!currentRouteData['showGlobalSearch'];
    });
  }

  get availableSortsObservable(): Observable<SortOption[]> {
    return this._availableSorts;
  }

  public set availableSorts(sorts: SortOption[]){
    this._availableSorts.next(sorts);
  }

  get queryObservable(): Observable<SearchQuery> {
    return this._querySubject;
  }

  get query(): SearchQuery {
    return this._query;
  }

  set query(value: SearchQuery){
    this._query = value;
    this._querySubject.next(value);
  }

  get showGlobalSearchObservable(): Observable<boolean> {
    return this._showGlobalSearchSubject;
  }

  get showGlobalSearch(){
    return this._showGlobalSearch;
  }

  set showGlobalSearch(value: boolean) {
    this._showGlobalSearch = value;
    this._showGlobalSearchSubject.next(value);
  }


}
