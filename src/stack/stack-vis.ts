import Stack from "./stack";
import StackAlgo from "./stack-algo";

export default class <T> implements Stack<T> {

    push(t: T): Promise<number> {
        throw new Error("Method not implemented.");
    }
    pop(): Promise<T | undefined> {
        throw new Error("Method not implemented.");
    }
    peek(): Promise<T | undefined> {
        throw new Error("Method not implemented.");
    }
    isEmpty(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    size(): Promise<number> {
        throw new Error("Method not implemented.");
    }

}
