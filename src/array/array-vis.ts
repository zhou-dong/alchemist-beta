import { TextCube } from '../commons/three';
import Array from './array';
import ArrayAlgo from './array-algo';

export default class ArrayVis<T> implements Array<T> {
  private array: ArrayAlgo<TextCube<T>>;

  constructor() {
    this.array = new ArrayAlgo<TextCube<T>>();
  }

  insert(index: number, value: T): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(index: number): Promise<T | undefined> {
    throw new Error('Method not implemented.');
  }

  update(index: number, value: T): Promise<void> {
    throw new Error('Method not implemented.');
  }

  get(index: number): Promise<T | undefined> {
    throw new Error('Method not implemented.');
  }

  contains(t: T): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  isEmpty(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  size(): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
