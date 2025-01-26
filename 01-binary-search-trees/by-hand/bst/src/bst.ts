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

  const tree: BinarySearchTree = {
    root: null
  }

  return tree;

};

/**
 * Initialize a new BTNode instance with the given data and no child data, and
 * return it.
 */
export const initNode = (data: number): BTNode => {
  const node: BTNode = {
    data: data,
    left: null,
    right: null
  }

  return node;
};

const addNode = (existingNode: BTNode, nodeToAdd: BTNode): BTNode => 
{
  if (nodeToAdd.data >= existingNode.data) 
  {
    if (existingNode.right === null) 
    {
      existingNode.right = nodeToAdd;
      return existingNode;
    } 
    else 
    {
      return addNode(existingNode.right, nodeToAdd);
    } 
  }
  else 
  {
    if (existingNode.left === null) 
    {
      existingNode.left = nodeToAdd;
      return existingNode;
    } 
    else 
    {
      return addNode(existingNode.left, nodeToAdd);
    } 
  }
}

const analyzeNode = (node: BTNode, data): BTNode => {
  if (node.data === data) 
  {
    return node;
  } 
  else 
  {
    let found: BTNode;
    if (node.left !== null)
    {
      found = analyzeNode(node.left, data);
      if (found)
      {
        return node.left;
      }
      if (node.right !== null) 
      {
        return analyzeNode(node.right, data);
      }
      else
      {
        return null;
      }
    } 
    else if (node.right !== null)
    {
      return analyzeNode(node.right, data);
    }
    else
    {
      return null;
    }
  }
}

const count = (node: BTNode, counter: number): number => {
  if (node.left !== null) {
    counter = count(node.left, counter + 1);
  }

  if (node.right !== null) {
    counter = count(node.right, counter + 1);
  }

  return counter;
}

const buildArray = (node: BTNode, dataList: number[]): number[] => {
  dataList.push(node.data);

  if (node.left !== null) {
    dataList = buildArray(node.left, dataList);
  }

  if (node.right !== null) {
    dataList = buildArray(node.right, dataList);
  }

  return dataList;
}

// ---------------------------------------------------------    [ Operations ]

/**
 * Inserts a new BTNode with the given data into the tree. This new node should
 * be placed in the correct location according to the invariants described in
 * the BTNode type. If this operation establishes a different tree root, the
 * `tree` argument's `root` field should be updated accordingly.
 */
export const insert = (tree: BinarySearchTree, data: number): void => 
{
  let newNode: BTNode = initNode(data);

  if (tree.root === null) 
  {
    tree.root = newNode;
  } 
  else 
  {
    addNode(tree.root, newNode);
  }
};

/**
 * Searches the tree for a node with the given data. Returns true if such a node
 * is found, false otherwise.
 */
export const contains = (root: BTNode, data: number): boolean => {
  let node: BTNode;
  if (root === null) {
    return false;
  } else {

    let node: BTNode = analyzeNode(root, data);
    if (node !== null) {
      return true;
    } else {
      return false;
    }
  }
};

/**
 * Searches the tree for a node with the given data. Returns the node if found,
 * null otherwise.
 */
export const getNode = (root: BTNode, data: number): BTNode => {
  if (root === null) {
    return null;
  } else {

    let node: BTNode = analyzeNode(root, data);
    if (node !== null) {
      return node;
    } else {
      return null;
    }
  }
};

/**
 * Returns the number of non-null nodes accessible from the given root node.
 * +20 min to time
 */
export const size = (root: BTNode): number => {
  if (root === null) {
    return 0;
  }
  let counter: number = 1;

  counter = count(root, counter);
  return counter;

};

/**
 * Returns a Javascript list containing the data in the tree in non-decreasing
 * order. If the given tree is empty, the returned list is empty.
 */
export const toArray = (root: BTNode): number[] => {
  let dataList: number[] = [];
  if (root === null) {
    return dataList
  }

  dataList = buildArray(root, dataList);
  return dataList.sort();
};

/**
 * Removes a BTNode with the given data from the tree, if such a node exists. If
 * no such tree exists, do nothing. If this operation establishes a different
 * tree root, the `tree` argument's `root` field should be updated accordingly.
 * Current time: 1:55:00
 */
export const remove = (tree: BinarySearchTree, data: number): void => {
  if (tree.root === null) {
    return;
  }


};
