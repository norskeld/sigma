import { defineComponent } from 'vue'

import './Type.css'

export const Composite = defineComponent({
  setup() {
    return () => (
      <span
        title="Composite parsers and combinators are built using other parsers/combinators."
        class="kind kind--composite"
      >
        composite
      </span>
    )
  }
})

export const Primitive = defineComponent({
  setup() {
    return () => (
      <span
        title="Primitive parsers and combinators are not using other parsers/combinators as building blocks."
        class="kind kind--primitive"
      >
        primitive
      </span>
    )
  }
})
