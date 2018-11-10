const mdo = M => (computation, context = {}) => {
  let vars = [];
  const varFactory = new Proxy(
    {},
    {
      get: (_, v) => {
        if (context.hasOwnProperty(v)) return context[v];

        vars.push(v);
        return v;
      },
    },
  );

  const steps = computation(varFactory);
  if (steps.length === 0) {
    throw "Computation in do block cannot be empty";
  }

  // Get the next step
  const next = steps[0];

  if (steps.length === 1) {
    if (typeof next === "function") {
      return next();
    }

    throw "Last step in a do block must be an expression and not an assignment";
  }

  const remaining = vars => computation(vars).slice(1);

  if (typeof next === "function") {
    return M.chain(_ => mdo(M)(remaining, context))(next());
  }

  const [v, m] = next;
  return M.chain(x => mdo(M)(remaining, { ...context, [v]: x }))(m());
};

module.exports = { mdo };
