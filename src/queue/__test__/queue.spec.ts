import Queue from "../index";
import Item from "../item";

test("queue FIFO", async () => {

    const queue = new Queue<number>();
    await queue.enqueue(new Item(10));
    await queue.enqueue(new Item(11));
    await queue.enqueue(new Item(12));

    expect(await queue.dequeue().then(item => item!.value)).toBe(10);
    expect(await queue.dequeue().then(item => item!.value)).toBe(11);
    expect(await queue.dequeue().then(item => item!.value)).toBe(12);
});

test("queue should return it's size after enqueue the new item", async () => {

    const queue = new Queue<number>();

    expect(await queue.enqueue(new Item(1))).toBe(1);
});

test("queue should return it's size", async () => {

    const queue = new Queue<number>();
    const promises = [
        queue.enqueue(new Item(1)),
        queue.enqueue(new Item(2)),
        queue.enqueue(new Item(3))
    ];
    await Promise.all(promises);

    expect(await queue.size()).toBe(promises.length);
});

