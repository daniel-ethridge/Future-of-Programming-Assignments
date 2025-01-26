import { contains, initTree } from "./bst";

test("contains - empty tree", () => {
  const t = initTree();
  expect(contains(t.root, 42)).toBe(false);
});

test("contains - single node tree", () => {
  const t = initTree();
  t.root = { data: 42, left: null, right: null };
  expect(contains(t.root, 42)).toBe(true);
  expect(contains(t.root, 43)).toBe(false);
});

test("contains - multi-node tree", () => {
  const t = initTree();
  t.root = {
    data: 42,
    left: { data: 23, left: null, right: null },
    right: { data: 611, left: null, right: null },
  };
  expect(contains(t.root, 42)).toBe(true);
  expect(contains(t.root, 23)).toBe(true);
  expect(contains(t.root, 611)).toBe(true);
  expect(contains(t.root, 43)).toBe(false);
  expect(contains(t.root, 24)).toBe(false);
  expect(contains(t.root, 610)).toBe(false);
});
