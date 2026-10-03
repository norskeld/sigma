export interface NumberNode {
  type: 'number'
  value: number
}

export interface ListNode {
  type: 'list'
  value: Array<NumberNode | ListNode>
}
