import { success, failure, State, Parser } from '../state'
import { size } from '../unicode'

export function string(match: string): Parser<string> {
  return {
    parse(state: State) {
      const index = state.index + match.length
      const slice = state.text.substring(state.index, index)

      switch (slice === match) {
        case true: {
          return success({ text: state.text, index }, match)
        }

        case false: {
          return failure(state, match)
        }
      }
    }
  }
}

export function uniString(match: string): Parser<string> {
  return {
    parse(state: State) {
      const index = state.index + size(match)
      const slice = state.text.substring(state.index, index)

      switch (slice === match) {
        case true: {
          return success({ text: state.text, index }, match)
        }

        case false: {
          return failure(state, match)
        }
      }
    }
  }
}

export { string as str, uniString as ustr }
