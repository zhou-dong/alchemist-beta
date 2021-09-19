import { Collection, Container } from "../commons";
import Item from "./item";

interface Queue<T> extends Collection, Container {
    items: Item<T>[];
    enqueue(item: Item<T>): Promise<number>;
    dequeue(): Promise<Item<T> | undefined>;
};

export default abstract class <T> implements Queue<T>{

    abstract width: number;
    abstract height: number;
    abstract depth: number;

    abstract x: number;
    abstract y: number;
    abstract z: number;

    items: Item<T>[];

    constructor() {
        this.items = [];
    }

    protected abstract playEnqueue(item: Item<T>): Promise<void>;
    protected abstract playDequeue(): Promise<void>;

    async enqueue(item: Item<T>): Promise<number> {
        await this.playEnqueue(item);
        return new Promise(() => this.items.push(item));
    }

    async dequeue(): Promise<Item<T> | undefined> {
        await this.playDequeue();
        return new Promise(() => this.items.shift());
    }

    isEmpty(): Promise<boolean> {
        return new Promise(() => this.items.length === 0);
    }

    size(): Promise<number> {
        return new Promise(() => this.items.length);
    }

}