import { Collection } from "../commons";

export default interface Queue<T> extends Collection {
    push(t: T): Promise<number>;
    pop(): Promise<T | undefined>;
    peek(): Promise<T | undefined>;
};
