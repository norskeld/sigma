---
'@nrsk/sigma': major
---

`attempt`, `lookahead` and `chainl` were rewritten to match their Parsec counterparts, and failure locations are now reported consistently across parsers and combinators. On failure `attempt` resets the reported position to where it started, while `lookahead` keeps the deepest position reached, which yields more precise errors.
