import {
  choice,
  commit,
  first,
  inner,
  many,
  map,
  recover,
  sepBy,
  sequence,
  syncNested,
  syncPast,
  syncTo,
} from '@combinators'
import { eof, fail, integer, letters, nothing, regexp, string } from '@parsers'
import { describe, it, run, should } from '@testing'

describe('recover', () => {
  it('should pass successes through untouched', () => {
    const parser = recover(string('a'), syncPast(string(';')), () => 'recovered')

    should.matchResult(run(parser, 'a'), {
      isOk: true,
      start: 0,
      end: 1,
      pos: 1,
      value: 'a',
    })
  })

  it('should pass uncommitted failures through untouched', () => {
    const parser = recover(string('a'), syncPast(string(';')), () => 'recovered')
    const actual = run(parser, 'z')

    should.matchResult(actual, {
      isOk: false,
      start: 0,
      end: 1,
      pos: 0,
      expected: 'a',
    })
  })

  it('should recover a committed failure', () => {
    const parser = recover(
      sequence(string('a'), commit(string('b'), 'inner')),
      syncPast(string(';')),
      (failure, span) => ({ failure: failure.expected, span }),
    )

    const actual = run(parser, 'az;rest')

    should.matchResult(actual, {
      isOk: true,
      start: 0,
      end: 3,
      pos: 3,
      value: { failure: 'b', span: { start: 0, end: 3 } },
      errors: [
        { isOk: false, start: 1, end: 2, pos: 1, expected: 'b', label: 'inner', errors: [] },
      ],
    })
  })

  it('should resolve to null without a fallback', () => {
    const parser = recover(commit(string('a'), 'x'), syncPast(string(';')))
    const actual = run(parser, 'z;')

    should.beEqual(actual.isOk, true)
    should.beEqual(actual.isOk ? actual.value : 'unreachable', null)
    should.matchErrors(actual, ['a'])
  })

  it('should re-raise the original failure when the strategy fails', () => {
    // `syncTo` never fails, so use a strategy that can: a literal that is not there.
    const parser = recover(commit(string('a'), 'x'), string('!'), () => 'recovered')
    const actual = run(parser, 'z')

    should.matchResult(actual, {
      isOk: false,
      start: 0,
      end: 1,
      pos: 0,
      expected: 'a',
      label: 'x',
    })
  })

  it('should re-raise it still committed, so choice gives up too', () => {
    const failing = recover(commit(string('a'), 'x'), string('!'), () => 'recovered')
    const actual = run(choice(failing, string('z')), 'z')

    // An uncommitted failure would let the second alternative win.
    should.matchResult(actual, {
      isOk: false,
      start: 0,
      end: 1,
      pos: 0,
      expected: 'a',
      label: 'x',
    })
  })

  it('should keep recoveries made inside the region when the strategy fails', () => {
    const nested = recover(commit(string('a'), 'a'), syncPast(string(';')), () => 'nested')
    const parser = recover(
      sequence(nested, commit(string('!'), 'bang')),
      string('#'),
      () => 'outer',
    )

    const actual = run(parser, 'z;q')

    // Nothing replaced the region, so the diagnostic found inside it still stands.
    should.matchResult(actual, {
      isOk: false,
      start: 2,
      end: 3,
      pos: 2,
      expected: '!',
      label: 'bang',
      errors: [{ isOk: false, start: 0, end: 1, pos: 0, expected: 'a', label: 'a', errors: [] }],
    })
  })

  it('should resynchronise from the failure, not from the start of the region', () => {
    // The valid prefix contains a `;`, so scanning from the region start would stop inside it.
    const text = inner(string('"'), regexp(/[^"]*/, 'text'), string('"'))

    const statement = map(
      sequence(
        string('set '),
        commit(sequence(letters(), string(' = '), text, string(';')), 'stmt'),
      ),
      ([, [name]]) => name,
    )

    const program = many(recover(statement, syncPast(string(';')), () => 'bad'))
    const actual = run(program, 'set a = "x;y" ?;set b = "z";')

    should.beStrictEqual(actual.isOk ? actual.value : null, ['bad', 'b'])
    should.matchErrors(actual, [';'])
  })

  it('should skip a balanced region with syncNested', () => {
    const parser = recover(
      sequence(string('{'), commit(string('a}'), 'block')),
      syncNested(string('{'), string('}')),
      () => 'bad',
    )

    const actual = run(parser, '{x{y}z}rest')

    should.matchResult(actual, {
      isOk: true,
      start: 0,
      end: 7,
      pos: 7,
      value: 'bad',
      errors: [
        { isOk: false, start: 1, end: 3, pos: 1, expected: 'a}', label: 'block', errors: [] },
      ],
    })
  })

  it('should stand in for a missing token with a strategy that consumes nothing', () => {
    const semi = recover(commit(string(';'), 'semi'), nothing(), () => null)
    const actual = run(sequence(string('a'), semi, string('b')), 'ab')

    should.matchResult(actual, {
      isOk: true,
      start: 0,
      end: 2,
      pos: 2,
      value: ['a', null, 'b'],
      errors: [{ isOk: false, start: 1, end: 2, pos: 1, expected: ';', label: 'semi', errors: [] }],
    })
  })

  it('should decline a failure with a different label', () => {
    const parser = recover(commit(string('a'), 'other'), syncPast(string(';')), () => 'recovered', {
      label: 'mine',
    })

    const actual = run(parser, 'z;')

    should.matchResult(actual, {
      isOk: false,
      start: 0,
      end: 1,
      pos: 0,
      expected: 'a',
      label: 'other',
    })
  })

  it('should decline an unlabelled failure when a label is required', () => {
    const parser = recover(commit(string('a')), syncPast(string(';')), () => 'recovered', {
      label: 'mine',
    })

    should.matchResult(run(parser, 'z;'), {
      isOk: false,
      start: 0,
      end: 1,
      pos: 0,
      expected: 'a',
      label: null,
    })
  })

  it('should accept a failure with a matching label', () => {
    const parser = recover(commit(string('a'), 'mine'), syncPast(string(';')), () => 'recovered', {
      label: 'mine',
    })

    const actual = run(parser, 'z;')

    should.beEqual(actual.isOk, true)
    should.beEqual(actual.isOk ? actual.value : null, 'recovered')
    should.matchLabels(actual, ['mine'])
  })
})

describe('recover end to end', () => {
  interface LetNode {
    kind: 'let'
    name: string
  }

  interface ErrorNode {
    kind: 'error'
    start: number
    end: number
  }

  const statement = map(
    sequence(string('let '), commit(first(letters(), string(';')), 'stmt')),
    ([, name]): LetNode => ({ kind: 'let', name }),
  )

  const program = many(
    recover(
      statement,
      syncPast(string(';')),
      (_failure, span): ErrorNode => ({ kind: 'error', start: span.start, end: span.end }),
    ),
  )

  it('should recover one bad statement in the middle', () => {
    const actual = run(program, 'let a;let ;let c;')

    should.matchResult(actual, {
      isOk: true,
      start: 0,
      end: 17,
      pos: 17,
      value: [
        { kind: 'let', name: 'a' },
        { kind: 'error', start: 6, end: 11 },
        { kind: 'let', name: 'c' },
      ],
      errors: [
        {
          isOk: false,
          start: 10,
          end: 10,
          pos: 10,
          expected: 'letters',
          label: 'stmt',
          errors: [],
        },
      ],
    })
  })

  it('should not manufacture an error node at the end of input', () => {
    const actual = run(program, 'let a;xyz')

    should.matchResult(actual, {
      isOk: true,
      start: 0,
      end: 6,
      pos: 6,
      value: [{ kind: 'let', name: 'a' }],
    })
  })

  it('should record several failures in source order', () => {
    const actual = run(program, 'let ;let b;let ;')

    should.beStrictEqual(actual.isOk ? actual.value : null, [
      { kind: 'error', start: 0, end: 5 },
      { kind: 'let', name: 'b' },
      { kind: 'error', start: 11, end: 16 },
    ])

    should.beStrictEqual(
      actual.errors.map((error) => error.pos),
      [4, 15],
    )
  })

  it('should account for unrecognised input when the loop commits to a catch-all', () => {
    const catchAll = many(
      recover(
        choice(statement, commit(fail('statement'), 'stmt')),
        syncPast(string(';')),
        (_failure, span): ErrorNode => ({ kind: 'error', start: span.start, end: span.end }),
      ),
    )

    const actual = run(first(catchAll, eof()), 'let a;xyz')

    should.beStrictEqual(actual.isOk ? actual.value : null, [
      { kind: 'let', name: 'a' },
      { kind: 'error', start: 6, end: 9 },
    ])

    should.matchErrors(actual, ['statement'])
  })

  it('should leave a clean parse with no errors', () => {
    const actual = run(program, 'let a;let b;')

    should.beEqual(actual.isOk, true)
    should.matchErrors(actual, [])
  })

  it('should drop errors recovered inside a rejected choice alternative', () => {
    const recovered = recover(commit(string('ab'), 'inner'), syncTo(string('!')), () => 'oops')

    // The first alternative recovers, then fails anyway; the second one wins.
    const parser = choice(sequence(recovered, string('never')), string('az'))
    const actual = run(parser, 'az')

    should.matchResult(actual, {
      isOk: true,
      start: 0,
      end: 2,
      pos: 2,
      value: 'az',
    })
  })

  it('should keep the outer error only when an outer recover replaces an inner one', () => {
    const arg = commit(integer(), 'arg')

    const args = recover(sepBy(arg, string(',')), syncTo(string(')')), () => 'bad-args', {
      label: 'arg',
    })

    const call = sequence(letters(), string('('), args, string(')'), commit(string('!'), 'bang'))
    const item = recover(call, syncPast(string(';')), () => 'bad-item')

    const actual = run(many(item), 'f(1,x)?;g(2)!;')

    should.beEqual(actual.isOk, true)
    should.beEqual(actual.isOk ? (actual.value as Array<unknown>).length : 0, 2)

    // The inner `bad-args` recovery is discarded, since the outer node covers the same region.
    should.matchErrors(actual, ['!'])
    should.matchLabels(actual, ['bang'])
  })
})
