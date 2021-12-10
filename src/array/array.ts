import { Collection } from '../commons';

export default interface Array<T> extends Collection {
  insert(index: number, value: T): Promise<void>;
  delete(index: number): Promise<T | undefined>;
  update(index: number, value: T): Promise<void>;
  get(index: number): Promise<T | undefined>;
  contains(t: T): Promise<boolean>;
}
