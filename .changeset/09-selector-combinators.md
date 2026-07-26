---
'@nrsk/sigma': major
---

Renamed the `take*` selector combinators and generalized them from fixed arity to variadic.

- `takeLeft` is now `first`, taking **two or more** parsers and returning the value of the first.
- `takeRight` is now `last`, taking **two or more** parsers and returning the value of the last.
- `takeMid` is now `inner`, taking **three or more** parsers. With exactly three it returns the value
  of the middle one as is; with more, it returns the values in between as a tuple.
- `takeSides` is now `outer`, taking **three or more** parsers and returning the values of the first
  and the last as a tuple.

Calling any of them below the minimum arity is a type error. The `takeUntil` and `skipUntil`
combinators are unaffected.

Also added the `ToFirst`, `ToLast` and `ToInner` utility types, so the return type of a wrapper built
on top of these combinators can be written out the same way `ToTuple` allows for `sequence`.
