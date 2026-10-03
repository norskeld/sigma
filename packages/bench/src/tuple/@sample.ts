import type * as Ast from './ast.ts'

interface Shape {
  /** How many levels of lists to nest. */
  depth: number
  /** How many numbers each list holds. */
  width: number
  /** A nested list follows every `nest`th number. */
  nest: number
}

const SMALL: Shape = { depth: 6, width: 4, nest: 2 }
const LARGE: Shape = { depth: 9, width: 8, nest: 4 }

function list(shape: Shape, depth: number, counter: { value: number }): Ast.ListNode {
  const value: Array<Ast.NumberNode | Ast.ListNode> = []

  for (let index = 0; index < shape.width; index++) {
    value.push({ type: 'number', value: counter.value++ })

    if (depth > 0 && index % shape.nest === shape.nest - 1) {
      value.push(list(shape, depth - 1, counter))
    }
  }

  return { type: 'list', value }
}

function generate(shape: Shape): Ast.ListNode {
  return list(shape, shape.depth, { value: 1 })
}

function render(node: Ast.NumberNode | Ast.ListNode): string {
  return node.type === 'number' ? String(node.value) : `(${node.value.map(render).join(', ')})`
}

/** Nesting depth 7, 6 elements per list, ~2.6 KB. */
export const EXPECTED_SMALL: Ast.ListNode = generate(SMALL)
export const SAMPLE_SMALL: string = render(EXPECTED_SMALL)

/** Nesting depth 10, 10 elements per list, ~49 KB. */
export const EXPECTED_LARGE: Ast.ListNode = generate(LARGE)
export const SAMPLE_LARGE: string = render(EXPECTED_LARGE)
