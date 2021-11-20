import { success, failure, State, Parser } from '../state'

export function regexp(re: RegExp, expected: string): Parser<string> {
  return {
    parse(state: State) {
      // Reset RegExp index, because we abuse the 'g' flag.
      re.lastIndex = state.index

      // `.exec` is actually a little bit faster than `.test`.
      const result = re.exec(state.text)

      if (result && result.index === state.index) {
        const [match] = result
        const index = state.index + match.length

        return success({ text: state.text, index }, match)
      } else {
        return failure(state, expected)
      }
    }
  }
}

export { regexp as re }
