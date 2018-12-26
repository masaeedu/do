const echo = new Proxy(
  {},
  {
    get: (_, v) => v
  }
);

const _ = Symbol();
const varname = s => (typeof s === "function" ? _ : s[0]);
const step = s => (typeof s === "function" ? s : s[1]);

const validate = vars => {
  const n = vars.length;

  // Empty do blocks make no sense
  if (n === 0) {
    throw "Computation in do block cannot be empty";
  }

  // Last step in a do block must be an expression
  // and not an assignment
  if (vars[n - 1] !== _) {
    throw "Last step in a do block must be an expression and not an assignment";
  }
};

const mdo = M => computation => {
  const vars = computation(echo).map(varname);

  const rec = ({ i, ctx }) => {
    const v = vars[i];
    const m = step(computation(ctx)[i]);

    // If this is the last step, evaluate and return it
    if (i === vars.length - 1) return m();

    const proceed = x => rec({ i: i + 1, ctx: { ...ctx, [v]: x } });
    return M.chain(proceed)(m());
  };

  return rec({ i: 0, ctx: {} });
};

module.exports = { mdo };
