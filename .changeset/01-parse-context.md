---
'@nrsk/sigma': major
---

Parsers now run against a single mutable `ParseContext` instead of receiving `(input, pos)` and returning a result object. `Parser<T>.parse` takes a `ParseContext` and returns either a value or the `FAIL` sentinel, updating `ctx.pos` and the error fields in place. Custom parsers must be rewritten accordingly: read the cursor from `ctx.pos`, and on failure return `FAIL` while leaving `ctx.pos` at its entry value.
