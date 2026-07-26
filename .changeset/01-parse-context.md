---
'@nrsk/sigma': major
---

Parsers now run against a single mutable `ParseContext` instead of receiving `(input, pos)` and returning a result object.
