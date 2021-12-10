import { AbstractArray, Iterable } from '../commons';
import IArray from './array';

export default class Array<T>
  extends AbstractArray<T>
  implements IArray<T>, Iterable<T>
{
  constructor() {
    super([]);
  }

  insert(index: number, value: T): Promise<void> {
    this.elements.splice(index, 0, value);
    return Promise.resolve();
  }

  delete(index: number): Promise<T | undefined> {
    const deleted = this.elements.splice(index, 1);
    return Promise.resolve(deleted[0]);
  }

  update(index: number, value: T): Promise<void> {
    this.elements[index] = value;
    return Promise.resolve();
  }

  get(index: number): Promise<T | undefined> {
    return Promise.resolve(this.elements[index]);
  }

  contains(t: T): Promise<boolean> {
    return Promise.resolve(this.elements.includes(t));
  }
}
