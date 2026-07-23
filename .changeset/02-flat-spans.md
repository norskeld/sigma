---
'@nrsk/sigma': major
---

`Span` is now a `{ start, end }` object instead of a `[start, end]` tuple, and `Success` and `Failure` expose `start` and `end` directly instead of a nested `span`. `ParserError` keeps its `span` field, now in the object form.
