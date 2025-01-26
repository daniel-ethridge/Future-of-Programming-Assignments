import { initTree, remove } from "./bst";

test("remove left leaf from three-node tree", () => {
  const t = initTree();
  t.root = {
    data: 42,
    left: { data: 23, left: null, right: null },
    right: { data: 611, left: null, right: null },
  };
  remove(t, 23);
  expect(t.root.data).toBe(42);
  expect(t.root.left).toBeNull();
  expect(t.root.right).not.toBeNull();
  expect(t.root.right.data).toBe(611);
  expect(t.root.right.left).toBeNull();
  expect(t.root.right.right).toBeNull();
});

test("remove right leaf from three-node tree", () => {
  const t = initTree();
  t.root = {
    data: 42,
    left: { data: 23, left: null, right: null },
    right: { data: 611, left: null, right: null },
  };
  remove(t, 611);
  expect(t.root.data).toBe(42);
  expect(t.root.left.data).toBe(23);
  expect(t.root.right).toBeNull();
});

test("remove an internal node with one child from multi-node tree", () => {
  const t = initTree();
  t.root = {
    data: 42,
    left: {
      data: 23,
      left: null,
      right: { data: 31, left: null, right: null },
    },
    right: { data: 611, left: null, right: null },
  };
  remove(t, 23);
  expect(t.root.data).toBe(42);
  expect(t.root.left).not.toBeNull();
  expect(t.root.left.data).toBe(31);
  expect(t.root.left.left).toBeNull();
  expect(t.root.left.right).toBeNull();
  expect(t.root.right).not.toBeNull();
  expect(t.root.right.data).toBe(611);
});
