import { initNode, initTree } from "./bst";

test("init tree", () => {
  const t = initTree();
  expect(t).not.toBeNull();
  expect(t.root).toBeNull();
});

test("init node", () => {
  const n = initNode(42);
  expect(n).not.toBeNull();
  expect(n.data).toBe(42);
  expect(n.left).toBeNull();
  expect(n.right).toBeNull();
});
