import { success, failure, State, Parser } from '../state'

export function eof(): Parser<null> {
  return {
    parse(state: State) {
      const isEof = state.index === state.text.length

      switch (isEof) {
        case true: {
          return success({ text: state.text, index: state.text.length }, null)
        }

        case false: {
          return failure(state, 'end of input')
        }
      }
    }
  }
}
