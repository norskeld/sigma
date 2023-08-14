import { grammar, run } from '@core'
import { Parser, Span, choice, integer, map, sepBy, string, takeMid } from '@lib'
import { describe, should, it } from '@testing'

describe(`grammar`, () => {
  interface NumberNode {
    type: 'number'
    span: Span
    value: number
  }

  interface ListNode {
    type: 'list'
    span: Span
    value: Array<NumberNode | ListNode>
  }

  const tupleGrammar = grammar({
    tupleNumber(): Parser<NumberNode> {
      return map(integer(), (value, span) => ({ type: 'number', span, value }))
    },
    tupleList(): Parser<ListNode> {
      return map(
        takeMid(
          string('('),
          sepBy(choice(this.tupleList, this.tupleNumber), string(',')),
          string(')')
        ),
        (value, span) => ({ type: 'list', span, value })
      )
    }
  })

  it('should succeed with exptected result', () => {
    const actual = run(tupleGrammar.tupleList).with('(1,2,(3,(4,5)))')
    const expected = {
      isOk: true,
      span: [0, 15],
      pos: 15,
      value: {
        type: 'list',
        span: [0, 15],
        value: [
          { type: 'number', span: [1, 2], value: 1 },
          { type: 'number', span: [3, 4], value: 2 },
          {
            type: 'list',
            span: [5, 14],
            value: [
              { type: 'number', span: [6, 7], value: 3 },
              {
                type: 'list',
                span: [8, 13],
                value: [
                  { type: 'number', span: [9, 10], value: 4 },
                  { type: 'number', span: [11, 12], value: 5 }
                ]
              }
            ]
          }
        ]
      }
    }

    should.matchState(actual, expected)
  })
})
