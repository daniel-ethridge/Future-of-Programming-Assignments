import { initTree, toArray } from "./bst";

test("toArray - empty tree", () => {
  const t = initTree();
  expect(toArray(t.root)).toEqual([]);
});

test("toArray - single node tree", () => {
  const t = initTree();
  t.root = { data: 58, left: null, right: null };
  expect(toArray(t.root)).toEqual([58]);
});

test("toArray - multi-node tree", () => {
  const t = initTree();
  t.root = {
    data: 58,
    left: { data: 21, left: null, right: null },
    right: {
      data: 899,
      left: {
        data: 77,
        left: null,
        right: null,
      },
      right: null,
    },
  };
  expect(toArray(t.root)).toEqual([21, 58, 77, 899]);
});
