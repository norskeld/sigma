---
'@nrsk/sigma': patch
---

Improved performance across parsers and combinators. The mutable parse context and flattened spans remove per-step result allocation, and hot paths avoid megamorphic dispatch. Overall improvements are: 2-4x faster, 5-10x less peak memory usage.
