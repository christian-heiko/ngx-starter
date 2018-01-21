
import {IDataContext} from './data-context';
import {Page, Pageable} from './page';
import {Filter} from './filter';
import {Observable} from 'rxjs/Observable';
import {MaterialDataContext} from './data-context-material';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {SimpleDataContext} from './data-context-simple';
import {PagedDataContext} from './data-context-paged';
import {ContinuableDataContext} from './data-context-continuable';
import {ContinuableListing} from './continuable-listing';
import {Sort} from './sort';


/**
 * Provides the ability to build a IDataContext<T>.
 */
export class DataContextBuilder<T> {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly logger = LoggerFactory.getLogger('DataContextBuilder');

    private _indexFn?: ((item: T) => any);
    private _localSort?: (a: T, b: T) => number;
    private _localApply?: ((data: T[]) => T[]);
    private _pageSize = 30;
    private _materialSupport = false;

    /***************************************************************************
     *                                                                         *
     * Static                                                                  *
     *                                                                         *
     **************************************************************************/

    /**
     * Creates a new DataContextBuilder.
     * @param logger A global logger instance
     * @returns The type of data to manage.
     */
    public static  start<T>(): DataContextBuilder<T> {
        return new DataContextBuilder<T>();
    }

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
    ) { }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    public indexBy(indexFn?: ((item: T) => any)): DataContextBuilder<T> {
        this._indexFn = indexFn;
        return this;
    }

    public pageSize(size: number): DataContextBuilder<T> {
        this._pageSize = size;
        return this;
    }

    /**
     * Adds support for Material DataSource to the resulting DataContext
     */
    public mdDataSource(): DataContextBuilder<T> {
        this._materialSupport = true;
        return this;
    }

    public localSorted(localSort: (a: T, b: T) => number): DataContextBuilder<T> {
        this._localSort = localSort;
        return this;
    }

    public localApply(localApply?: ((data: T[]) => T[])): DataContextBuilder<T> {
        this._localApply = localApply;
        return this;
    }

    public build( listFetcher: (sorts: Sort[], filters?: Filter[]) => Observable<Array<T>>): IDataContext<T> {
        return this.applyProxies(new SimpleDataContext<T>(
            listFetcher,
            this._indexFn,
            this._localSort,
            this._localApply));
    }


    public buildPaged(
        pageLoader: (pageable: Pageable, filters?: Filter[]) => Observable<Page<T>>
    ): IDataContext<T> {

        return this.applyProxies(new PagedDataContext<T>(
            pageLoader,
            this._pageSize,
            this._indexFn,
            this._localSort,
            this._localApply
        ));
    }

    public buildContiunuation(
        continuationLoader: (nextToken: string, filters?: Filter[]) => Observable<ContinuableListing<T>>
    ): IDataContext<T> {
        return this.applyProxies(new ContinuableDataContext<T>(
            continuationLoader,
            this._pageSize,
            this._indexFn,
            this._localSort,
            this._localApply
        ));
    }

    public buildEmpty(): IDataContext<T> {
        let emptyContext = new SimpleDataContext<T>( (a, b) => Observable.empty());
        return this.applyProxies(emptyContext);
    }

    private applyProxies(context:  IDataContext<T>): IDataContext<T> {
        if (this._materialSupport) {
            context = new MaterialDataContext(context);
        }
        return context;
    }

}
