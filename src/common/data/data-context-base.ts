import {Observable} from 'rxjs/Observable';
import {Filter} from './filter';
import {IDataContext} from './data-context';
import {Logger, LoggerFactory} from '@elderbyte/ts-logger';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Sort} from './sort';
import {Subject} from 'rxjs/Subject';


export abstract class BaseDataContext<T> implements IDataContext<T> {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly baseLog: Logger = LoggerFactory.getLogger('BaseDataContext');

    private _total = 0;
    private _loading = false;

    private _sorts: Sort[] = [];
    private _filters: Filter[] = [];


    private _rows: T[] = [];
    private _dataChange = new BehaviorSubject<T[]>([]);
    private _primaryIndex = new Map<any, T>();

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
        private _indexFn?: ((item: T) => any),
        private _localSort?: ((a: T, b: T) => number),
        private _localApply?: ((data: T[]) => T[])
    ) {
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    public start(sorts?: Sort[], filters?: Filter[]): Observable<any> {
        this.reset();
        this.setSorts(sorts);
        this.setFilters(filters);
        return this.loadMoreInternalNow();
    }

    public get total(): number {
        return this._total;
    }

    public get sorts(): Sort[] {
        return this._sorts;
    }

    public get filters(): Filter[] {
        return this._filters;
    }

    /**
     * @deprecated Switch to isLoading property!
     */
    public get loadingIndicator(): boolean {
        return this.isLoading;
    }

    public get isLoading(): boolean {
        return this._loading;
    }

    public findByIndex(key: any): T | undefined {
        if (!this._indexFn) { throw new Error('findByIndex requires you to pass a index function!'); }
        return this._primaryIndex.get(key);
    }

    public get rowsChanged(): Observable<T[]> {
        return this._dataChange;
    }

    public get rows(): T[]{
        return this._rows;
    }

    public set rows(rows: T[]) {

        if (this._localApply) {
            rows = this._localApply(rows);
        }

        if (this._localSort) {
            this.baseLog.debug(`Apply local sort to ${rows.length} rows ...`);
            rows.sort(this._localSort);
        }

        this._rows = rows;
        this.baseLog.debug('data-context: Rows have changed: ' + this._rows.length);

        this._dataChange.next(this._rows);
    }

    public loadMore(): Observable<any> {

        if (this.isLoading) { return Observable.empty(); }

        if (this.hasMoreData) {
            return this.loadMoreInternalNow();
        } else {
            this.baseLog.debug('Cannot load more data, since no more data available.');
            return Observable.empty();
        }
    }

    public loadAll(sorts?: Sort[], filters?: Filter[]): void {

        this.baseLog.debug('Starting to load all data ...');

        // load first page
        this.start(sorts, filters)
            .subscribe(() => {
                this.baseLog.debug('First page has been loaded. Loading remaining data ...');
                // load rest in a recursive manner
                this.loadAllRec();
            }, err => {
                this.baseLog.error('Failed to load first page of load all procedure!', err);
            });
    }

    /***************************************************************************
     *                                                                         *
     * Private methods                                                         *
     *                                                                         *
     **************************************************************************/

    protected reset(): void {
        this._total = 0;
        this.rows = [];
        this.loading = false;
        this._primaryIndex.clear();
    }

    protected setTotal(value: number): void {
        this._total = value;
    }


    protected set loading(value: boolean) {
        this._loading = value;
    }

    /**
     * Insert the given data into this data-context starting at the given index
     * @param data The new data
     * @param index The base index at which to insert.
     */
    protected insertData(data: T[], index: number): void {
        let newRows = [...this.rows];
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            newRows[i + index] = item;
            this.indexItem(item);
        }
        this.rows = newRows;
    }

    /**
     * Append the given data at the end of this data context
     */
    protected appendData(data: T[]): void {
        let newRows = [...this.rows];
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            newRows[i] = item;
            this.indexItem(item);
        }
        this.rows = newRows;
    }

    protected setSorts(sorts?: Sort[]) {
        this._sorts = sorts ? sorts.slice(0) : []; // clone
    }

    protected setFilters(filters?: Filter[]) {
        this._filters = filters ? filters.slice(0) : []; // clone
    }

    protected updateIndex(): void {
        this._primaryIndex.clear();
        this.rows.forEach(item => this.indexItem(item));
    }

    protected indexItem(item: T): void {
        let key = this.getItemKey(item);
        if (key) {
            this._primaryIndex.set(key, item);
        }
    }

    private getItemKey(item: T): any  {
        if (this._indexFn) {
            return this._indexFn(item);
        }
        return null;
    }

    protected loadMoreInternalNow(): Observable<any> {

        const sub = new Subject();

        try {
            this.loadMoreInternal()
                .subscribe(
                    success => sub.next(success),
                    err => sub.error(err),
                    () => sub.complete()
                );
        }catch (err) {
            sub.error(err);
            sub.complete();
        }

        return sub.take(1);
    }

    /***************************************************************************
     *                                                                         *
     * Abstract methods                                                        *
     *                                                                         *
     **************************************************************************/

    /**
     * Has this data-context's source more data available which can be loaded?
     */
    public abstract get hasMoreData(): boolean;

    /**
     * Load additional data from the source.
     * @returns Returns an observable which indicates the completion of loading the next chunk.
     */
    protected abstract loadMoreInternal(): Observable<any>;

    /***************************************************************************
     *                                                                         *
     * Private methods                                                        *
     *                                                                         *
     **************************************************************************/

    private loadAllRec(): void {
        this.loadMore()
            .subscribe(() => {
                this.baseLog.debug('Successfully loaded data chunk. Loading next now ...');
                this.loadAllRec();
            }, err => {
                this.baseLog.error('Loading all failed!', err);
            }, () => {
                this.baseLog.info('All data loaded completely.');
            });
    }
}
