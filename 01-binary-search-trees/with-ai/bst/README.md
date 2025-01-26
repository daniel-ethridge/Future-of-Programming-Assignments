# Binary Search Trees

**NOTE:** for general advice on how to get, edit, and submit homework, check out
the [GENERAL.MD](GENERAL.MD) file. That will be the case for all homeworks.

## Overview

Binary trees have nodes with up to two children each. Binary _search_ trees
impose an additional rule that the data in the left child has a "smaller" value
than the parent; and the right child has a "larger" value than the
parent.

In this homework, we are using numbers as the data values, so you can use simple
inequalities to test for sort order.

Our binary search trees will support duplicate values. When duplicates are
allowed, we have to choose between a 'left' bias (where the left child can be
equal to the parent) or a 'right' bias. For this homework, our tree will have a
'right' bias. This means left children data values will be strictly less than
the parent's, and right children values will be greater than or equal to the
parent values.

When _inserting_ new data, it is unambiguous where a node should be placed: we
simply find the empty spot underneath an existing node where that data would be
expected to be, and place it there.

When _removing_ data, we have a decision to make about what the tree looks like,
specifically when a node-to-remove has two children. Using the binary search
tree invariant of "left is less", we could potentially restructure the tree with
the target node's sort order predecessor, or successor. For this homework, the
unit tests expect that you'll choose the _predecessor_.

Check out the lecture slides for more on this. The unit tests use the same tree
data as the lecture to make it easier to follow along.

## Specific homework advice

The file you edit for this homework is `bst.ts`. It is recommended (but not
required) that you implement the functions in the order given.

There are 9 or so tests to cover specific operations you will implement. They
are all named like `bst.something.test.ts`, where `something` is the particular
function.

As always, run all tests with `npm test`, or run a specific test with `npm test 
something`.

The `remove` function is particularly tricky. It is split into
simple/medium/hard levels of difficulty. If you're focused on (say) the hard
remove tests, you can run them with `npm test remove.hard`.

You will almost certainly need to create your own helper functions. If you
_don't_ do that you're likely making your life harder than it needs to be. Go
ahead and define your helper functions directly in the file with all the others,
it should work just fine. The unit tests won't know about them, of course, but
your implementation functions will!

Start early. _Make sketches_ to help understand what you code should do.
Use the debugger or judicious console.log statements to understand what it
actually is doing.

**Good luck!**
