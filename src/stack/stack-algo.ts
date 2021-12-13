import { AbstractArray, Iterable } from '../commons';
import { IStack } from './stack';

export class StackAlgo<T>
  extends AbstractArray<T>
  implements IStack<T>, Iterable<T>
{
  constructor() {
    super([]);
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
}
