# General advice on what to do

## TLDR

1. For help with the specific homework assignment, see `README.md`.
2. Install [NodeJS and NPM](https://nodejs.org/) if they aren't installed yet.
3. Run `npm i` from the homework's top directory to install packages.
4. Incrementally write code: switch between editing and testing.
    * Edit in whichever editor you like
    * Test with `npm test` or `npm test sometestname`
5. You're encouraged to commit incremental improvements to git.
6. Submit homework.

## Command Line, Git, and GitHub

This homework asks you to use a command line interface and git. If you need a
refresher, here are a couple crash courses:

* [Command Line Interface (CLI) Crash Course](https://gist.github.com/johnsogg/bfa37707275b67e4e8ac6a87009cc491)
* [Git and GitHub Crash Course](https://gist.github.com/johnsogg/56df0f970bd9e019da861fd37ceb42f8)

## Install NodeJS and NPM

To work this assignment you'll need NodeJS installed. Node is a runtime
environment that understands Javascript. A related tool is called NPM, which
stands for the Node Package Manager, and it comes along with Node. Go to
[nodejs.org](https://nodejs.org/) to install them. You'll only need to download
and install a single package and you'll get both of those tools. And you only
need to do this one time for the lifetime of your computer.

To determine if these tools are installed on your machine, open a command line
and run `node --version` and `npm --version`. If they're there, they'll report
their version numbers. I happen to get this:

```console
$ node --version
v20.8.0
$ npm --version
10.1.0
```

## One time for this repo: install packages

The homework assignment has a few dependencies - these are separate libraries
that this code requires to build, run, or test. Fortunately, the `npm` tool
makes it very easy to work with dependencies.

Open a terminal, and go to the directory where the `package.json` file is. Then
run `npm install`, or as a shortcut, simply `npm i`. It will read the package
file (and you should check it out too!) and see what the dependencies are. It
then goes off to npmjs.com and fetches them. It also gets the
dependencies-of-dependencies, and all of _their_ dependencies as well.

If you get warnings about packages being deprecated, don't worry about it.

The homework depends on a few things, in case you're curious. The rabbit hole
here is deep, so you can go off and research more if you like, but the summary
is:

* `jest`: this is the unit testing tool, and we will use it to automatically
  grade your work.
* `typescript`: this lets your editor and the other tools understand the
  Typescript language.

## Write Code

Each assignment has a bunch of source files that end with `.ts` which tells the
editor that they're Typescript files. Two broad groups here: _test_ files and
_implementation_ files.

**Test files** have names that end with `test.ts`, such as `aabb.add.test.ts`.
You should not commit any edits you might make to them. If you do, my spies will
know and it will get awkward. Definitely feel free to play around with them,
though - there's a lot to learn from test files!

**Implementation files** are the other `.ts` files, like `aabb.ts`, and these
are the ones you are meant to edit for your homework. They are filled with type
definitions and functions, and many of those are just stubs for you to fill in.
Just look for `// IMPLEMENT` and replace that with your code. Read the comment
for specifics. For example:

```ts
/**
 * Create and return an empty AABB, using Infinity and -Infinity for the min/max
 * values respectively.
 */
export const initAabb = (): Aabb => {
    // IMPLEMENT
    return null;
}
```

Here, there's a function called `initAabb`, and it should return an `Aabb`
object. The comment tells you what to do. In this case, there is also a `return`
statement - you'll also need to replace this with something that works. These
are included to make the program compile.

It doesn't technically matter which order you implement things, but the intent
is for you to build things in the order they appear in the file. That's not a
rule, just friendly advice.

You can use any editor you like to work with the code. Personally I use VS Code,
but that's up to you.

## Running Tests

From the command line, make sure you're in the top level directory (the one with
`package.json` in it). From there:

* **`npm test`**: Runs all tests
* **`npm test foo`** Runs all tests that have 'foo' in the name

This will run the `test` target defined in the `package.json` file, which just
defers to the local copy of `jest`. Run all the tests to see what is left to
work on, and then use the second form to run isolated tests.

The test files are all named things like `aabb.calc.test.ts`, so if you want to
focus on knocking out that test by itself, run `npm test calc`. See the pattern?

Each test file will correspond to a batch of points when this is graded.

**Pro Tip** - open the test files that relate to the code you're implementing.
They tell you exactly what they're doing and what they expect. If you're
confused about why your code is failing the tests, you can just read the tests
and find out. Very informative!

There is one special test, `sanity.test.ts` and its related source file,
`sanity.ts`. This is a sanity test of the system setup, and _it should pass out
of the box_, after you've run `npm i`. If it doesn't, there's some bigger
problem and you should ask for help.

## Use Git To Submit Homework

The homework assignment you're looking at comes from GitHub, and you originally
made a copy of it by accepting an assignment on GitHub Classroom. Once you clone
your copy of the repo, it is separate from everybody else's. You'll edit code,
add/commit changes locally, and when you're ready for it to be graded, you'll
push it up to the remote. 

The general flow is like this. My username is `johnsogg` and yours will differ.

```console
$ git clone git@github.com:Gabe-Courses/hw-01-aabb-johnsogg.git
$ cd hw-01-aabb-johnsogg         # be sure you're in the homework dir!
$ npm i                          # install dependencies
$ npm test sanity                # ensure setup is correct - should pass!
$ npm test                       # run all tests, see which fail
$                                # edit with any editor you like
$ npm test calc                  # run specific 'calc' test
$ git add -u                     # add edited files to changeset
$ git commit -m "Nailed it"      # commit changeset
$ npm test                       # run tests again, hopefully all pass?
$                                # repeat above process until you're happy
$ npm push                       # send it off to Github for grading!
```

Once you've run `npm push` (assuming you've committed changes), GitHub Classroom
will run `npm test` on its side. If the grade that Classroom gives you is
different from you get on your side, tell us about it.

Some of the files are protected because if they weren't you could just give
yourself 100%. Protected files are the things in the `.github` directory, and
all the `*.test.ts` files. If you edit those, Classroom will let us know. Don't
make it weird.

You can `git push` as often as you like, so if you're sitting at (say 75%) and
want to come back to this later, go ahead and submit anyway, and you can come
back to it later and re-submit.