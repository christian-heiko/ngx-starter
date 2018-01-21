
import {Filter} from './filter';
import {Observable} from 'rxjs/Observable';
import {Sort} from './sort';


/**
 * Manages a set of data (rows) which are to be displayed in a UI Component.
 *
 */
export interface IDataContext<T> {

    // Properties
    rows: T[];
    readonly total: number;
    readonly sorts: Sort[];
    readonly filters: Filter[];
    readonly loadingIndicator: boolean;

    readonly hasMoreData: boolean;

    // Observable data
    readonly rowsChanged: Observable<T[]>;

    // Public API

    /**
     * Loads more data if any available.
     *
     */
    loadMore(): Observable<any>;


    /**
     * Loads all available data. In case of
     * paged context loads page by page until finished.
     */
    loadAll(sorts?: Sort[], filters?: Filter[]): void;

    /**
     * Starts populating data context by loading first
     * batch of data.
     */
    start(sorts?: Sort[], filters?: Filter[]): Observable<any>;

    findByIndex(key: any): T | undefined;
}




