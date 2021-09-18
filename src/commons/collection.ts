export interface Collection {
    isEmpty(): boolean;
    size(): number;
    capacity?(): number;
}
