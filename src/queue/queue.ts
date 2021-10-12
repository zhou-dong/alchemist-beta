import { Collection } from "../commons";

export default interface Queue<T> extends Collection {
    enqueue(t: T): Promise<number>;
    dequeue(): Promise<T | undefined>;
    peek(): Promise<T | undefined>;
};
