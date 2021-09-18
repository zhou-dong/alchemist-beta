import { Collection } from "../commons";

export interface Queue<T> extends Collection {
    enQueue(arg: T): void
    deQueue(): T
}
