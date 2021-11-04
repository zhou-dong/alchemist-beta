import { ArrayIterator, Iterator, Iterable } from '../commons';
import IStack from './stack';

export default class<T> implements IStack<T>, Iterable<T> {
  private elements: T[];

  constructor() {
    this.elements = [];
  }

  push(t: T): Promise<number> {
    return Promise.resolve(this.elements.push(t));
  }

  pop(): Promise<T | undefined> {
    return Promise.resolve(this.elements.pop());
  }

  peek(): Promise<T | undefined> {
    return Promise.resolve(this.elements[this.elements.length - 1]);
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
