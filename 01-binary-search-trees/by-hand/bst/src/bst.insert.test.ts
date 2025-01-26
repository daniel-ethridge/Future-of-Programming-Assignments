import { initTree, insert } from "./bst";

test("insert one value an empty BST", () => {
  const t = initTree();
  expect(t).not.toBeNull();
  insert(t, 42);
  expect(t.root).not.toBeNull();
  expect(t.root.data).toBe(42);
  expect(t.root.left).toBeNull();
  expect(t.root.right).toBeNull();
});

test("insert several values into an empty BST", () => {
  const t = initTree();
  expect(t).not.toBeNull();
  expect(t.root).toBeNull();
  insert(t, 23);
  insert(t, 611);
  expect(t.root.data).toBe(23);
  expect(t.root.left).toBeNull();
  expect(t.root.right).not.toBeNull();
  const six11 = t.root.right;
  expect(six11.data).toBe(611);
  insert(t, 42);
  expect(six11.left).not.toBeNull();
  expect(six11.left.data).toBe(42);
  expect(six11.right).toBeNull();
  insert(t, 1099);
  expect(six11.right).not.toBeNull();
  expect(six11.right.data).toBe(1099);
});
