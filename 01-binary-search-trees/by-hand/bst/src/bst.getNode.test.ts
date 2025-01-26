import { getNode, initTree } from "./bst";

test("get node - empty tree", () => {
  const t = initTree();
  expect(getNode(t.root, 42)).toBeNull();
});

test("get node - single node tree", () => {
  const t = initTree();
  t.root = { data: 42, left: null, right: null };
  expect(getNode(t.root, 42)).toBe(t.root);
  expect(getNode(t.root, 43)).toBeNull();
});

test("get node - multi-node tree", () => {
  const t = initTree();
  t.root = {
    data: 42,
    left: { data: 23, left: null, right: null },
    right: { data: 611, left: null, right: null },
  };
  expect(getNode(t.root, 42)).toBe(t.root);
  expect(getNode(t.root, 23)).toBe(t.root.left);
  expect(getNode(t.root, 611)).toBe(t.root.right);
  expect(getNode(t.root, 43)).toBeNull();
  expect(getNode(t.root, 24)).toBeNull();
  expect(getNode(t.root, 610)).toBeNull();
});
