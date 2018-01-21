import {BaseDataContext} from './data-context-base';
import {Observable} from 'rxjs/Observable';
import {Filter} from './filter';
import {Subject} from 'rxjs/Subject';
import {Logger, LoggerFactory} from '@elderbyte/ts-logger';
import {Sort} from './sort';


export class SimpleDataContext<T> extends BaseDataContext<T> {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly log: Logger = LoggerFactory.getLogger('SimpleDataContext');

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
        private listFetcher: (sorts: Sort[], filters: Filter[]) => Observable<Array<T>>,
        indexFn?: ((item: T) => any),
        localSort?: ((a: T, b: T) => number),
        localApply?: ((data: T[]) => T[])
    ) {
        super(indexFn, localSort, localApply);
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    public get hasMoreData(): boolean {
        return false;
    }

    public loadAll(sorts?: Sort[], filters?: Filter[]): void {
        this.loadMore();
    }

    /***************************************************************************
     *                                                                         *
     * Private methods                                                         *
     *                                                                         *
     **************************************************************************/


    protected loadMoreInternal(): Observable<any> {

        const subject = new Subject();

        this.loading = true;
        if (this.listFetcher) {
            this.listFetcher(this.sorts, this.filters)
                .take(1)
                .subscribe(
                    list => {
                        this.setTotal(list.length);
                        this.rows = list;
                        this.loading = false;
                        this.log.debug('Got list data: ' + list.length);

                        subject.next();
                    }, err => {
                        this.setTotal(0);
                        this.rows = [];
                        this.loading = false;
                        this.updateIndex();
                        this.log.error('Failed to query data', err);

                        subject.error(err);
                    });
        }else {
            this.log.warn('Skipping data context load - no list fetcher present!');
            subject.error(new Error('data-context: Skipping data context load - no list fetcher present!'));
        }

        return subject.take(1);
    }
}
