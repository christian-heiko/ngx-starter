
import {Observable} from 'rxjs';
import {Filter} from './filter';
import {Page, Pageable} from './page';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/take';
import {Logger, LoggerFactory} from '@elderbyte/ts-logger';
import {BaseDataContext} from './data-context-base';



/**
 * Represents a data-context with a paginated data-source.
 */
export class PagedDataContext<T> extends BaseDataContext<T> {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly logger: Logger = LoggerFactory.getLogger('PagedDataContext');

    private readonly _limit;

    private _pageCache: Map<number, Observable<Page<T>>> = new Map();
    private _latestPage: number;

    /***************************************************************************
     *                                                                         *
     * Constructors                                                            *
     *                                                                         *
     **************************************************************************/


    constructor(
        private pageLoader: (pageable: Pageable, filters: Filter[]) => Observable<Page<T>>,
        pageSize: number,
        _indexFn?: ((item: T) => any),
        _localSort?: ((a: T, b: T) => number),
        _localApply?: ((data: T[]) => T[])) {
        super(_indexFn, _localSort, _localApply);
        this._limit = pageSize;
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    public get hasMoreData(): boolean {
        return this.total > this.rows.length;
    }

    /***************************************************************************
     *                                                                         *
     * Private Methods                                                         *
     *                                                                         *
     **************************************************************************/

    /**
     * Load the next chunk of data.
     * Useful for infinite scroll like data flows.
     *
     */
    protected loadMoreInternal(): Observable<any> {
        this.logger.info('Loading more...' + this._latestPage);
        let nextPage = this._latestPage + 1;
        return this.fetchPage(nextPage, this._limit);
    }

    protected reset() {
        super.reset();
        this._pageCache = new Map();
        this._latestPage = -1;
    }

    private fetchPage(pageIndex: number, pageSize: number): Observable<any> {

        const subject = new Subject();

        let pageRequest = new Pageable(pageIndex, pageSize, this.sorts);

        if (this._pageCache.has(pageIndex)) {
            // Page already loaded - skipping request!
            this.logger.trace('Skipping fetching page since its already in page observable cache.');
            subject.next();
        }else {

            this.loading = true;

            this.logger.debug(`Loading page ${pageIndex} using pageable:`, pageRequest);

            let pageObs = this.pageLoader(pageRequest, this.filters);

            this._pageCache.set(pageIndex, pageObs);

            pageObs.subscribe((page: Page<T>) => {


                this.logger.debug('Got page data:', page);

                this.populatePageData(page);

                if (this._latestPage < page.number) {
                    this._latestPage = page.number; // TODO This might cause that pages are skipped
                }

                this.loading = false;

                subject.next();

            }, err => {

                this.loading = false;
                this.logger.error('Failed to query data', err);

                subject.error(err);
            });
        }

        return subject.take(1);
    }

    /**
     * Load the data from the given page into the current data context
     */
    private populatePageData(page: Page<T>) {
        try {
            this.setTotal(page.totalElements);
            const startIndex = page.number * page.size;
            this.insertData(page.content, startIndex);
        }catch (err) {
            this.logger.error('Failed to populate data with page', page, err);
        }
    }
}
