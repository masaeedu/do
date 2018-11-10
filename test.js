const { test } = require("ava");
const { mdo } = require(".");

test("it can build monadic computations", t => {
  const Arr = {
    of: x => [x],
    chain: f => ma => ma.reduce((p, c) => [...p, ...f(c)], []),
  };

  const result = mdo(Arr)(({ x, y }) => [
    [x, () => [1, 2, 3]],
    [y, () => [4, 5, 6]],
    () => Arr.of(x + y),
  ]);

  t.snapshot(result);
});
