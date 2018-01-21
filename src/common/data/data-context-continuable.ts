import {BaseDataContext} from './data-context-base';
import {Observable} from 'rxjs/Observable';
import {Filter} from './filter';
import {Logger, LoggerFactory} from '@elderbyte/ts-logger';
import {ContinuableListing} from './continuable-listing';

/**
 * Supports infinite data-sources with continuation tokens.
 */
export class ContinuableDataContext<T> extends BaseDataContext<T> {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly logger: Logger = LoggerFactory.getLogger('ContinuableDataContext');

    private readonly _maxSize: number;

    private nextToken: string | undefined;

    /***************************************************************************
     *                                                                         *
     * Constructors                                                            *
     *                                                                         *
     **************************************************************************/


    constructor(
        private continuationLoader: (nextToken?: string, filters?: Filter[]) => Observable<ContinuableListing<T>>,
        maxSize: number,
        _indexFn?: ((item: T) => any),
        _localSort?: ((a: T, b: T) => number),
        _localApply?: ((data: T[]) => T[])) {
        super(_indexFn, _localSort, _localApply);
        this._maxSize = maxSize;
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    public get hasMoreData(): boolean {
        return !!this.nextToken;
    }

    /***************************************************************************
     *                                                                         *
     * Internal                                                                *
     *                                                                         *
     **************************************************************************/

    protected loadMoreInternal(): Observable<any> {

        this.logger.debug('Loading more data with token: ' + this.nextToken);

        return this.continuationLoader(this.nextToken, this.filters)
            .map(data => {
                this.appendData(data.content);

                if (data.hasMore) {
                    this.nextToken = data.nextContinuationToken;
                }else {
                    this.nextToken = undefined;
                }
            });
    }
}
