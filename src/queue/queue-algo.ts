import Queue from "./queue";

export default class <T> implements Queue<T>{

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

}
