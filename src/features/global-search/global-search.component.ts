import {
  Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild,
} from '@angular/core';
import {GlobalSearchService, SearchQuery, SortOption} from './global-search.service';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {Sort} from '../../common/data/sort';



@Component({
  selector: 'global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent implements OnInit, OnDestroy {

  private _searchCollapsed = true;
  private _txtSearch: ElementRef;
  private _subs: Subscription[] = [];

  @Output()
  public onSearchCollapsed = new EventEmitter<boolean>();

  @Input('hideWhenDisabled')
  public hideWhenDisabled: boolean;

  private _availableSort: SortOption[] = [];
  public selectedSort: SortOption;
  public sortAsc = false;
  public globalSearchDisabled: boolean;

  constructor(
    private router: Router,
    private globalSearch: GlobalSearchService) {

    this.globalSearchDisabled = !globalSearch.showGlobalSearch;


    this._subs.push(

      globalSearch.showGlobalSearchObservable
        .subscribe(value => {
          this.globalSearchDisabled = !value;
        }),

      this.globalSearch.availableSortsObservable
        .subscribe(available => {
          this.availableSort = available;
        }),

      router.events
        .filter(event => event instanceof NavigationEnd)
        .subscribe(() => {
          this.searchCollapsed = true;
        })
    );
  }

  public set availableSort(available: SortOption[]){
    this._availableSort = available;
    if (available.length > 0) {
        this.selectedSort = available[0];
    }
  }

  public get availableSort(): SortOption[] {
      return this._availableSort;
  }

  public get canSort(): boolean {
    return this._availableSort && this.availableSort.length > 0;
  }


  ngOnInit() {
    this.searchCollapsed = true;
  }


  ngOnDestroy(): void {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  @Input()
  get searchCollapsed(): boolean {
    return this._searchCollapsed;
  }

  @ViewChild('txtSearch')
  set txtSearch(input: ElementRef) {
    this._txtSearch = input;
  }

  set searchCollapsed(value: boolean) {
    this._searchCollapsed = value;
    this.onSearchCollapsed.emit(this.searchCollapsed);
    if (!this._searchCollapsed) {
      setTimeout(() => this._txtSearch.nativeElement.focus(), 0);
    }
  }

  get toggleIcon(): string {
    return this.searchCollapsed ? 'search' : 'close';
  }

  public toggleSearch() {
    if (this.searchCollapsed) {
      // Show search
      this.searchCollapsed = false;
    }else {
      // Collapse search
      this.searchCollapsed = true;
      this.globalSearch.query = SearchQuery.Empty;
    }
  }

  get isSearchHidden(): boolean {
    return this.hideWhenDisabled && this.globalSearchDisabled;
  }

  public toggleSortAsc(): void {
    this.sortAsc = !this.sortAsc;
    this.onQueryChanged();
  }

  public sortBy(sort: SortOption) {
    this.selectedSort = sort;
    this.onQueryChanged();
  }

  public onQueryChanged() {

    let sorts = this.selectedSort ? [this.convertToSort(this.selectedSort)] : [];

    this.globalSearch.query = new SearchQuery(
        this.keywordsValue,
        sorts
    );
  }

  private convertToSort(sort: SortOption): Sort {
      return new Sort(sort.id, this.sortAsc ? 'asc' : 'desc');
  }

  private get keywordsValue(): string {
    if (this._txtSearch) {
      let txtInput = this._txtSearch.nativeElement as HTMLInputElement;
      return txtInput.value;
    }
    return '';
  }

}
