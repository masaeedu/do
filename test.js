const { test } = require("ava");
const { mdo } = require(".");

const Arr = {
  of: x => [x],
  chain: f => ma => ma.reduce((p, c) => [...p, ...f(c)], [])
};

test("it can build monadic computations", t => {
  const result = mdo(Arr)(({ x, y }) => [
    [x, () => [1, 2, 3]],
    [y, () => [4, 5, 6]],
    () => Arr.of(x + y)
  ]);

  t.snapshot(result);
});

test("it rejects empty do blocks", t => {
  try {
    mdo(Arr)(({}) => []);
  } catch (e) {
    t.snapshot(e);
  }
});

test("it rejects do blocks that end with an assignment", t => {
  try {
    mdo(Arr)(({ x }) => [[x, () => [1, 2]]]);
  } catch (e) {
    t.snapshot(e);
  }
});
