# `@masaeedu/do`

## Summary

General purpose do notation for monads

## Usage

```js
const { mdo } = require("@masaeedu/do")

// :: type Monad m = { of: a -> m a, chain: (a -> m b) -> m a -> m b }

// :: Monad []
const Arr = (() => {
  // :: a -> [a]
  const of = x => [x]

  // :: (a -> [b]) -> [a] -> [b]
  const chain = amb => ma => ma.reduce((p, a) => [...p, ...amb(a)], [])

  return { of, chain }
})()

const computation = mdo(Arr)(({ x, y }) => [
  [x, () => [1, 2]],
  [y, () => [3, 4]],
  () => Arr.of(x * y)
])

console.log(computation) // => [3, 4, 6, 8]
```
