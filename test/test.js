// https://github.com/avajs/ava/blob/HEAD/docs/01-writing-tests.md

const test = require("ava");
const normalizeUrl = require("./index.js");

// test.skip //skip test
/*


*/

function promiseFn() {}

test.todo("will think about writing this later");
test("promises the truth", async (t) => {
  const value = await promiseFn();
  t.true(value);
});

test("unique name", (t) => {});
test.serial("run test in sequence", (t) => {
  t.pass();
});
test("main", (t) => {
  t.is(normalizeUrl("sindresorhus.com"), "http://sindresorhus.com");
});

test("stripAuthentication option", (t) => {
  t.is(
    normalizeUrl("http://user:password@www.sindresorhus.com"),
    "http://sindresorhus.com"
  );
});
test.before((t) => {
  // This runs before all tests
});

test.before((t) => {
  // This runs concurrently with the above
});

test.serial.before((t) => {
  // This runs after the above
});

test.serial.before((t) => {
  // This too runs after the above, and before tests
});

test.after("cleanup", (t) => {
  // This runs after all tests
});

test.after.always("guaranteed cleanup", (t) => {
  // This will always run, regardless of earlier failures
});

test.beforeEach((t) => {
  // This runs before each test
});

test.afterEach((t) => {
  // This runs after each test
});

test.afterEach.always((t) => {
  // This runs after each test and other test hooks, even if they failed
});

const macro = test.macro((t, input, expected) => {
  t.is(eval(input), expected);
});

test("2 + 2 = 4", macro, "2 + 2", 4);
test("2 * 3 = 6", macro, "2 * 3", 6);

test("does not have exponential performance for data URLs", (t) => {
  for (let index = 0; index < 1000; index += 50) {
    const url =
      "data:" + Array.from({ length: index }).fill(",#").join("") + "\ra";
    const start = Date.now();

    try {
      normalizeUrl(url);
    } catch {}

    const difference = Date.now() - start;
    t.true(difference < 100, `Execution time: ${difference}`);
  }
});
