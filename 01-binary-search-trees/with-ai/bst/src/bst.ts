// bst.ts

// ---------------------------------------------------------    [ Types ]

/**
 * A binary search tree structure simply contains the root node of a binary
 * search tree. If the tree is empty, the root node is null.
 *
 * This structure is simply used to contain the root node of the tree. During
 * mutation operations it is possible for the root node to change.
 */
export type BinarySearchTree = {
  root: BTNode | null;
};

/**
 * A binary search tree node contains a piece of data, and references to the
 * left and right children. If there is no left or right child, the
 * corresponding reference is null.
 *
 * The data found on the left side of the tree is strictly less than the data in
 * this node. The data on the right side should be greater than or equal to this
 * data. Duplicate values in the tree are allowed, however each individual node
 * is independent.
 */
export type BTNode = {
  data: number;
  left: BTNode | null;
  right: BTNode | null;
};

// ---------------------------------------------------------    [ Initialize ]

/**
 * Initialize a new, empty BinarySearchTree instance and return it.
 */
export const initTree = (): BinarySearchTree => {
  return { root: null };
};

/**
 * Initialize a new BTNode instance with the given data and no child data, and
 * return it.
 */
export const initNode = (data: number): BTNode => {
  return { data, left: null, right: null };
};

// ---------------------------------------------------------    [ Operations ]

/**
 * Inserts a new BTNode with the given data into the tree. This new node should
 * be placed in the correct location according to the invariants described in
 * the BTNode type. If this operation establishes a different tree root, the
 * `tree` argument's `root` field should be updated accordingly.
 */
export const insert = (tree: BinarySearchTree, data: number): void => {
  const newNode = initNode(data);
  if (tree.root === null) {
    tree.root = newNode;
    return;
  }

  let current = tree.root;
  while (true) {
    if (data < current.data) {
      if (current.left === null) {
        current.left = newNode;
        return;
      }
      current = current.left;
    } else {
      if (current.right === null) {
        current.right = newNode;
        return;
      }
      current = current.right;
    }
  }
};

/**
 * Searches the tree for a node with the given data. Returns true if such a node
 * is found, false otherwise.
 */
export const contains = (root: BTNode | null, data: number): boolean => {
  let current = root;
  while (current !== null) {
    if (data === current.data) {
      return true;
    } else if (data < current.data) {
      current = current.left;
    } else {
      current = current.right;
    }
  }
  return false;
};

/**
 * Searches the tree for a node with the given data. Returns the node if found,
 * null otherwise.
 */
export const getNode = (root: BTNode | null, data: number): BTNode | null => {
  let current = root;
  while (current !== null) {
    if (data === current.data) {
      return current;
    } else if (data < current.data) {
      current = current.left;
    } else {
      current = current.right;
    }
  }
  return null;
};

/**
 * Returns the number of non-null nodes accessible from the given root node.
 */
export const size = (root: BTNode | null): number => {
  if (root === null) {
    return 0;
  }
  return 1 + size(root.left) + size(root.right);
};

/**
 * Returns a Javascript list containing the data in the tree in non-decreasing
 * order. If the given tree is empty, the returned list is empty.
 */
export const toArray = (root: BTNode | null): number[] => {
  if (root === null) {
    return [];
  }
  return [...toArray(root.left), root.data, ...toArray(root.right)];
};

/**
 * Removes a BTNode with the given data from the tree, if such a node exists. If
 * no such tree exists, do nothing. If this operation establishes a different
 * tree root, the `tree` argument's `root` field should be updated accordingly.
 */
export const remove = (tree: BinarySearchTree, data: number): void => {
  tree.root = removeNode(tree.root, data);
};

const removeNode = (root: BTNode | null, data: number): BTNode | null => {
  if (root === null) {
    return null;
  }

  if (data < root.data) {
    root.left = removeNode(root.left, data);
    return root;
  } else if (data > root.data) {
    root.right = removeNode(root.right, data);
    return root;
  } else {
    // Case 1: Leaf node
    if (root.left === null && root.right === null) {
      return null;
    }
    // Case 2: Only right child
    if (root.left === null) {
      return root.right;
    }
    // Case 3: Only left child
    if (root.right === null) {
      return root.left;
    }
    // Case 4: Two children
    // First find the predecessor (largest value in left subtree)
    let predecessor = root.left;
    let parent = root;
    while (predecessor.right !== null) {
      parent = predecessor;
      predecessor = predecessor.right;
    }
    
    // Replace current node's data with predecessor's data
    root.data = predecessor.data;
    
    // Remove the predecessor
    if (parent === root) {
      parent.left = predecessor.left;
    } else {
      parent.right = predecessor.left;
    }
    
    return root;
  }
};
