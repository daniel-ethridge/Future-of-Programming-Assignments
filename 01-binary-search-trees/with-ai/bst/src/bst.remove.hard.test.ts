import { initTree, remove } from "./bst";

test("remove an internal node with two children from a multi-node tree", () => {
  const t = buildTree();
  // remove 10. result should be the tree with 9 in place of 10.
  remove(t, 10);
  expect(t.root.data).toBe(7);
  expect(t.root.left.data).toBe(3);
  expect(t.root.left.left.data).toBe(1);
  expect(t.root.left.right.data).toBe(5);
  expect(t.root.right.data).toBe(9); // this used to be 10
  expect(t.root.right.left.data).toBe(9); // this stayed the same
});

test("remove the root node from a multi-node tree", () => {
  const t = buildTree();
  // remove 7. result should be the tree with 5 as the new root.
  remove(t, 7);
  expect(t.root.data).toBe(5);
  expect(t.root.left.data).toBe(3);
  expect(t.root.left.left.data).toBe(1);
  expect(t.root.left.right).toBeNull();
  expect(t.root.right.data).toBe(10);
  expect(t.root.right.left.data).toBe(9);
  expect(t.root.right.right.data).toBe(13);
  expect(t.root.right.right.left.data).toBe(11);
  expect(t.root.right.right.right.data).toBe(15);
});

const buildTree = () => {
  const t = initTree();
  // set the tree's data to the numbers 7, 3, 10, 1, 5, 9, 13, 8, 9, 11, 15.
  // this is the tree from the lecture slides, "remove: two children". Note that
  // it contains two 9s!
  t.root = {
    data: 7, // root
    left: {
      data: 3, // root.left
      left: {
        data: 1, // root.left.left
        left: null,
        right: null,
      },
      right: {
        data: 5, // root.left.right
        left: null,
        right: null,
      },
    },
    right: {
      data: 10, // root.right
      left: {
        data: 9, // root.right.left
        left: {
          data: 8, // root.right.left.left
          left: null,
          right: null,
        },
        right: {
          data: 9, // root.right.left.right,
          left: null,
          right: null,
        },
      },
      right: {
        data: 13, // root.right.right
        left: {
          data: 11, // root.right.right.left
          left: null,
          right: null,
        },
        right: {
          data: 15, // root.right.right.right
          left: null,
          right: null,
        },
      },
    },
  };
  return t;
};
