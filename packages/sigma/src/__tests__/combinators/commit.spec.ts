import { backtrack, choice, commit, sequence } from '@combinators'
import { string } from '@parsers'
import { describe, it, run, should } from '@testing'

describe('commit', () => {
  it('should behave like the wrapped parser on success', () => {
    const parser = sequence(string('if'), commit(string('('), 'cond'))
    const actual = run(parser, 'if(')

    should.matchResult(actual, {
      isOk: true,
      start: 0,
      end: 3,
      pos: 3,
      value: ['if', '('],
    })
  })

  it('should stop choice from trying later alternatives', () => {
    const ifStmt = sequence(string('if'), commit(string('('), 'cond'))
    const other = string('ifx')

    // Without the commit the second alternative wins, since it reaches further.
    const plain = run(choice(sequence(string('if'), string('(')), other), 'ifx')

    should.matchResult(plain, {
      isOk: true,
      start: 0,
      end: 3,
      pos: 3,
      value: 'ifx',
    })

    const committed = run(choice(ifStmt, other), 'ifx')

    should.matchResult(committed, {
      isOk: false,
      start: 2,
      end: 3,
      pos: 2,
      expected: '(',
      label: 'cond',
    })
  })

  it('should report the label on the failure', () => {
    const actual = run(commit(string('a'), 'the-a'), 'b')

    should.beEqual(actual.isOk, false)
    should.beEqual(!actual.isOk ? actual.label : null, 'the-a')
  })

  it('should default the label to null', () => {
    const actual = run(commit(string('a')), 'b')

    should.matchResult(actual, {
      isOk: false,
      start: 0,
      end: 1,
      pos: 0,
      expected: 'a',
      label: null,
    })
  })

  it('should keep the innermost label', () => {
    const parser = commit(sequence(string('a'), commit(string('b'), 'inner')), 'outer')
    const actual = run(parser, 'ax')

    should.matchResult(actual, {
      isOk: false,
      start: 1,
      end: 2,
      pos: 1,
      expected: 'b',
      label: 'inner',
    })
  })

  it('should fall back to an outer label when the innermost commit has none', () => {
    const parser = commit(sequence(string('a'), commit(string('b'))), 'outer')
    const actual = run(parser, 'ax')

    should.matchResult(actual, {
      isOk: false,
      start: 1,
      end: 2,
      pos: 1,
      expected: 'b',
      label: 'outer',
    })
  })

  it('should keep an empty label rather than treating it as absent', () => {
    const parser = commit(sequence(string('a'), commit(string('b'), '')), 'outer')
    const actual = run(parser, 'ax')

    should.matchResult(actual, {
      isOk: false,
      start: 1,
      end: 2,
      pos: 1,
      expected: 'b',
      label: '',
    })
  })
})

describe('backtrack', () => {
  it('should uncommit a committed failure so choice keeps going', () => {
    const ifStmt = sequence(string('if'), commit(string('('), 'cond'))
    const actual = run(choice(backtrack(ifStmt), string('ifx')), 'ifx')

    should.matchResult(actual, {
      isOk: true,
      start: 0,
      end: 3,
      pos: 3,
      value: 'ifx',
    })
  })

  it('should be transparent on success', () => {
    const actual = run(backtrack(commit(string('a'), 'x')), 'a')

    should.matchResult(actual, {
      isOk: true,
      start: 0,
      end: 1,
      pos: 1,
      value: 'a',
    })
  })

  it('should clear the label from an uncommitted failure', () => {
    const actual = run(backtrack(commit(string('a'), 'x')), 'b')

    should.matchResult(actual, {
      isOk: false,
      start: 0,
      end: 1,
      pos: 0,
      expected: 'a',
      label: null,
    })
  })
})
