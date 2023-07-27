import { defineComponent } from 'vue'

import './Type.css'

export const Composite = defineComponent({
  setup() {
    return () => (
      <a href="/introduction/primitives-and-composites#composite">
        <span
          title="Composite parsers and combinators are built using other parsers/combinators."
          class="kind kind--composite"
        >
          composite
        </span>
      </a>
    )
  }
})

export const Primitive = defineComponent({
  setup() {
    return () => (
      <a href="/introduction/primitives-and-composites#primitive">
        <span
          title="Primitive parsers and combinators are built without using other parsers/combinators."
          class="kind kind--primitive"
        >
          primitive
        </span>
      </a>
    )
  }
})
