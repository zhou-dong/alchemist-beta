import { Iterable } from "../commons/iterable";
import { Iterator } from "../commons/iterator";
import IQueue from "./queue";

class QueueIterator<T> implements Iterator<T> {

    private items: T[];
    private current: number;

    constructor(items: T[]) {
        this.items = items;
        this.current = 0;
    }

    hasNext(): boolean {
        return this.current < this.items.length;
    }

    next(): T {
        const result = this.items[this.current];
        this.current += 1;
        return result;
    }
}

export default class Queue<T> implements IQueue<T>, Iterable<T>{

    private elements: T[];

    constructor() {
        this.elements = [];
    }

    enqueue(element: T): Promise<number> {
        return Promise.resolve(this.elements.push(element));
    }

    dequeue(): Promise<T | undefined> {
        return Promise.resolve(this.elements.shift());
    }

    peek(): Promise<T | undefined> {
        return Promise.resolve(this.elements[0]);
    }

    isEmpty(): Promise<boolean> {
        return Promise.resolve(this.elements.length === 0);
    }

    size(): Promise<number> {
        return Promise.resolve(this.elements.length);
    }

    iterator(): Iterator<T> {
        return new QueueIterator<T>(this.elements);
    }
}
