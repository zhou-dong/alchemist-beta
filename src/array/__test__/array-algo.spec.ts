import Array from '../array-algo';

test('array insert', async () => {
  const array = new Array<number>();

  await array.insert(0, 2);
  await array.insert(0, 1);
  await array.insert(0, 0);
  await expect(array.get(0)).resolves.toBe(0);
  await expect(array.get(1)).resolves.toBe(1);
  await expect(array.get(2)).resolves.toBe(2);

  await array.insert(1, 3);
  await expect(array.get(0)).resolves.toBe(0);
  await expect(array.get(1)).resolves.toBe(3);
  await expect(array.get(2)).resolves.toBe(1);
  await expect(array.get(3)).resolves.toBe(2);
});

test('array delete', async () => {
  const array = new Array<number>();

  await array.insert(0, 0);
  await array.insert(1, 1);
  await array.insert(2, 2);
  await array.insert(3, 3);

  const deleted1 = await array.delete(2);
  expect(deleted1 === 2);
  await expect(array.size()).resolves.toBe(3);

  const deleted2 = await array.delete(2);
  expect(deleted2 === 3);
  await expect(array.size()).resolves.toBe(2);
});

test('array update and get', async () => {
  const array = new Array<number>();

  await array.insert(0, 0);
  await array.insert(1, 1);
  await array.insert(2, 2);
  await array.insert(3, 3);

  await array.update(1, 10);
  await expect(array.get(1)).resolves.toBe(10);

  await array.update(2, 25);
  await expect(array.get(2)).resolves.toBe(25);

  await array.update(1, 15);
  await expect(array.get(1)).resolves.toBe(15);
});

test('array contains', async () => {
  const array = new Array<number>();

  await array.insert(0, 0);
  await array.insert(1, 10);
  await array.insert(2, 20);
  await array.insert(3, 30);

  await expect(array.contains(10)).resolves.toBe(true);
  await expect(array.contains(20)).resolves.toBe(true);
  await expect(array.contains(1)).resolves.toBe(false);
  await expect(array.contains(2)).resolves.toBe(false);
});
