import { ArrayIterator, Iterator, Iterable } from '../commons';
import IQueue from './queue';

export default class<T> implements IQueue<T>, Iterable<T> {
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
    return new ArrayIterator<T>(this.elements);
  }
}
