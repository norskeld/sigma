import { success, failure, State, Parser } from '../state'

export function string(match: string): Parser<string> {
  return {
    parse(state: State) {
      const endIndex = state.index + match.length

      if (state.text.substring(state.index, endIndex) === match) {
        return success({ text: state.text, index: endIndex }, match)
      } else {
        return failure(state, match)
      }
    }
  }
}

export { string as str }
