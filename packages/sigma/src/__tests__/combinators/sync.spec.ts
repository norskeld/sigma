import { commit, recover, sequence, syncNested, syncPast, syncTo } from '@combinators'
import { nothing, string } from '@parsers'
import { describe, it, run, should } from '@testing'

describe('syncTo', () => {
  it('should stop before the sync point', () => {
    should.matchResult(run(syncTo(string(';')), 'abc;rest'), {
      isOk: true,
      start: 0,
      end: 3,
      pos: 3,
      value: null,
    })
  })

  it('should stop at the end of input when the sync point is absent', () => {
    should.matchResult(run(syncTo(string(';')), 'abc'), {
      isOk: true,
      start: 0,
      end: 3,
      pos: 3,
      value: null,
    })
  })

  it('should consume nothing when the sync point is where it starts', () => {
    should.matchResult(run(syncTo(string(';')), ';;'), {
      isOk: true,
      start: 0,
      end: 0,
      pos: 0,
      value: null,
    })
  })

  it('should not split surrogate pairs', () => {
    // Each emoji is two UTF-16 code units, so a correct scan lands on 4, not 3.
    should.matchResult(run(syncTo(string(';')), '😀😀;'), {
      isOk: true,
      start: 0,
      end: 4,
      pos: 4,
      value: null,
    })
  })

  it('should succeed on empty input', () => {
    should.matchResult(run(syncTo(string(';')), ''), {
      isOk: true,
      start: 0,
      end: 0,
      pos: 0,
      value: null,
    })
  })

  it('should not leak the sync parser commitments', () => {
    should.matchResult(run(syncTo(commit(string(';'), 'sync')), 'abc'), {
      isOk: true,
      start: 0,
      end: 3,
      pos: 3,
      value: null,
    })
  })

  it('should not leak recoveries made by a failing sync probe', () => {
    // Recovers, then fails anyway, so every probe leaves an entry behind unless it is truncated.
    const sync = sequence(
      recover(commit(string('q'), 'q'), nothing(), () => null),
      string('!'),
    )

    should.matchErrors(run(syncTo(sync), 'abc'), [])
  })

  it('should not leak recoveries made by a matching sync probe', () => {
    const sync = recover(commit(string('q'), 'q'), nothing(), () => null)

    should.matchErrors(run(syncTo(sync), 'abc'), [])
  })
})

describe('syncPast', () => {
  it('should consume the sync point', () => {
    should.matchResult(run(syncPast(string(';')), 'abc;rest'), {
      isOk: true,
      start: 0,
      end: 4,
      pos: 4,
      value: null,
    })
  })

  it('should stop at the end of input when the sync point is absent', () => {
    should.matchResult(run(syncPast(string(';')), 'abc'), {
      isOk: true,
      start: 0,
      end: 3,
      pos: 3,
      value: null,
    })
  })

  it('should consume the sync point where it starts', () => {
    should.matchResult(run(syncPast(string(';')), ';;'), {
      isOk: true,
      start: 0,
      end: 1,
      pos: 1,
      value: null,
    })
  })

  it('should not split surrogate pairs', () => {
    should.matchResult(run(syncPast(string(';')), '😀😀;'), {
      isOk: true,
      start: 0,
      end: 5,
      pos: 5,
      value: null,
    })
  })

  it('should succeed on empty input', () => {
    should.matchResult(run(syncPast(string(';')), ''), {
      isOk: true,
      start: 0,
      end: 0,
      pos: 0,
      value: null,
    })
  })

  it('should not leak the sync parser commitments', () => {
    should.matchResult(run(syncPast(commit(string(';'), 'sync')), 'abc'), {
      isOk: true,
      start: 0,
      end: 3,
      pos: 3,
      value: null,
    })
  })

  it('should not leak recoveries made by a failing sync probe', () => {
    const sync = sequence(
      recover(commit(string('q'), 'q'), nothing(), () => null),
      string('!'),
    )

    should.matchErrors(run(syncPast(sync), 'abc'), [])
  })
})

describe('syncNested', () => {
  const parser = syncNested(string('('), string(')'))

  it('should skip out to the closing delimiter', () => {
    should.matchResult(run(parser, 'abc)rest'), {
      isOk: true,
      start: 0,
      end: 4,
      pos: 4,
      value: null,
    })
  })

  it('should respect nesting', () => {
    should.matchResult(run(parser, 'a(b)c)rest'), {
      isOk: true,
      start: 0,
      end: 6,
      pos: 6,
      value: null,
    })
  })

  it('should respect nesting more than one level deep', () => {
    should.matchResult(run(parser, 'a(b(c)d)e)f'), {
      isOk: true,
      start: 0,
      end: 10,
      pos: 10,
      value: null,
    })
  })

  it('should stop at the first closing delimiter it balances', () => {
    should.matchResult(run(parser, 'abc))'), {
      isOk: true,
      start: 0,
      end: 4,
      pos: 4,
      value: null,
    })
  })

  it('should fail when the region is never closed', () => {
    should.matchResult(run(parser, 'a(b)c'), {
      isOk: false,
      start: 0,
      end: 0,
      pos: 0,
      expected: 'nested region',
    })
  })

  it('should fail on empty input', () => {
    should.matchResult(run(parser, ''), {
      isOk: false,
      start: 0,
      end: 0,
      pos: 0,
      expected: 'nested region',
    })
  })

  it('should not split surrogate pairs', () => {
    should.matchResult(run(parser, '😀😀)'), {
      isOk: true,
      start: 0,
      end: 5,
      pos: 5,
      value: null,
    })
  })

  it('should support identical delimiters', () => {
    // `close` is tried first, so a quote ends the region instead of opening a nested one.
    const quoted = syncNested(string('"'), string('"'))

    should.matchResult(run(quoted, 'ab"cd'), {
      isOk: true,
      start: 0,
      end: 3,
      pos: 3,
      value: null,
    })
  })

  it('should ignore zero-width delimiter matches', () => {
    const zero = syncNested(nothing(), string(')'))

    should.matchResult(run(zero, 'ab)'), {
      isOk: true,
      start: 0,
      end: 3,
      pos: 3,
      value: null,
    })
  })

  it('should not leak the delimiter commitments', () => {
    const committed = syncNested(commit(string('('), 'open'), commit(string(')'), 'close'))

    should.matchResult(run(committed, 'ab)'), {
      isOk: true,
      start: 0,
      end: 3,
      pos: 3,
      value: null,
    })
  })

  it('should not leak the delimiter commitments when it fails', () => {
    const committed = syncNested(commit(string('('), 'open'), commit(string(')'), 'close'))

    should.matchResult(run(committed, 'ab'), {
      isOk: false,
      start: 0,
      end: 0,
      pos: 0,
      expected: 'nested region',
    })
  })
})
