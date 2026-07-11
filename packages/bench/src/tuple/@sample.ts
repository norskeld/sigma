import type * as Ast from './ast.ts'

function list(depth: number, counter: { value: number }): Ast.ListNode {
  const value: Array<Ast.NumberNode | Ast.ListNode> = []

  for (let index = 0; index < 4; index++) {
    value.push({ type: 'number', value: counter.value++ })

    if (depth > 0 && index % 2 === 1) {
      value.push(list(depth - 1, counter))
    }
  }

  return { type: 'list', value }
}

function render(node: Ast.NumberNode | Ast.ListNode): string {
  return node.type === 'number' ? String(node.value) : `(${node.value.map(render).join(', ')})`
}

export const EXPECTED: Ast.ListNode = list(6, { value: 1 })
export const SAMPLE: string = render(EXPECTED)
