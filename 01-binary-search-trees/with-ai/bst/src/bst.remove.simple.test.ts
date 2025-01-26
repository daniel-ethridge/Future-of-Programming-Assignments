import { initTree, remove } from "./bst";

test("remove non-existing value from empty tree", () => {
  const t = initTree();
  remove(t, 42);
  expect(true).toBe(true); // check that we didn't crash
});

test("remove non-existing value from single node tree", () => {
  const t = initTree();
  t.root = { data: 42, left: null, right: null };
  remove(t, 23);
  expect(t.root.data).toBe(42);
  expect(t.root.left).toBeNull();
  expect(t.root.right).toBeNull();
});

test("remove non-existing value from three-node tree", () => {
  const t = initTree();
  t.root = {
    data: 42,
    left: { data: 23, left: null, right: null },
    right: { data: 611, left: null, right: null },
  };
  remove(t, 43);
  expect(t.root.data).toBe(42);
  expect(t.root.left.data).toBe(23);
  expect(t.root.right.data).toBe(611);
  expect(t.root.left.left).toBeNull();
  expect(t.root.left.right).toBeNull();
  expect(t.root.right.left).toBeNull();
  expect(t.root.right.right).toBeNull();
});
