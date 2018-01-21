
export class ContinuableListing<T> {
    public content: T[];
    public hasMore: boolean;
    public continuationToken: string;
    public nextContinuationToken: string;
    public maxChunkSize: number;
}
