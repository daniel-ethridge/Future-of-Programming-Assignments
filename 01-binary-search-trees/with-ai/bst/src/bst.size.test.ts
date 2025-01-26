import { initTree, size } from "./bst";

test("size - empty tree", () => {
  const t = initTree();
  expect(size(t.root)).toBe(0);
});

test("size - single node tree", () => {
  const t = initTree();
  t.root = { data: 42, left: null, right: null };
  expect(size(t.root)).toBe(1);
});

test("size - multi-node tree", () => {
  const t = initTree();
  t.root = {
    data: 42,
    left: { data: 23, left: null, right: null },
    right: { data: 611, left: null, right: null },
  };
  expect(size(t.root)).toBe(3);
});
