

import {DataSource, CollectionViewer} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import {IDataContext} from './data-context';
import {Filter} from './filter';
import {Sort} from './sort';



/**
 * Adapter for a data-context for the Angular Material DataSource
 */
export class MaterialDataContext<T> extends DataSource<T> implements IDataContext<T> {

    constructor(
        private datacontext: IDataContext<T>) {
        super();
        if (!datacontext) { throw Error('datacontext must not be NULL!'); }
    }


    public connect(collectionViewer: CollectionViewer): Observable<T[]> {
        return this.datacontext.rowsChanged;
    }

    public disconnect(collectionViewer: CollectionViewer): void {
    }

    public get rows(): T[] { return this.datacontext.rows; }
    public set rows(data: T[]) { this.datacontext.rows = data; }

    public get total(): number { return this.datacontext.total; }

    public get sorts(): Sort[] { return this.datacontext.sorts; }

    public get filters(): Filter[] {return this.datacontext.filters; }

    public get loadingIndicator(): boolean { return this.datacontext.loadingIndicator; }

    public get rowsChanged(): Observable<T[]> { return this.datacontext.rowsChanged; }


    public start(sorts?: Sort[], filters?: Filter[]): Observable<any> {
        return this.datacontext.start(sorts, filters);
    }

    public findByIndex(key: any): T | undefined {
        return this.datacontext.findByIndex(key);
    }

    public get hasMoreData(): boolean {
        return this.datacontext.hasMoreData;
    }

    public loadMore(): Observable<any> {
        return this.datacontext.loadMore();
    }

    public loadAll(sorts?: Sort[], filters?: Filter[]): void {
        this.datacontext.loadAll(sorts, filters);
    }

}
