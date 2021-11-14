import { access, copyFile } from 'fs/promises'
import { constants } from 'fs'

interface Success {
  kind: 'success'
  message: string
}

interface Failure {
  kind: 'failure'
  reason: string
}

type Result = Success | Failure
type Actions = Record<string, () => Promise<Result>>

async function actions(actions: Actions): Promise<Result> {
  const [passed] = process.argv.slice(2)
  const resolved = actions[passed]

  if (resolved) {
    return await resolved()
  }

  return {
    kind: 'failure',
    reason: `Action '${passed}' is not defined.`
  }
}

async function run(result: Result) {
  switch (result.kind) {
    case 'success': {
      console.log(result.message)
      return
    }

    case 'failure': {
      console.error(result.reason)
      process.exit(1)
    }
  }
}

async function main() {
  const cwd = process.cwd()

  await run(
    await actions({
      /** This should be called in `prepack`. */
      async prepare() {
        try {
          // Just double-check for `dist` directory.
          await access(`${cwd}/package.json`, constants.F_OK)

          // Copy necessary files.
          await copyFile(`${cwd}/package.json`, `${cwd}/dist/package.json`)
          await copyFile(`${cwd}/CHANGELOG.md`, `${cwd}/dist/CHANGELOG.md`)
          await copyFile(`${cwd}/README.md`, `${cwd}/dist/README.md`)
          await copyFile(`${cwd}/LICENSE`, `${cwd}/dist/LICENSE`)

          return {
            kind: 'success',
            message: 'Successfully prepared files for a release.'
          }
        } catch (error) {
          return {
            kind: 'failure',
            reason: (error as Error).message
          }
        }
      },

      /** This should be called in `postversion`. */
      async restore() {
        try {
          // Copy back.
          await copyFile(`${cwd}/dist/package.json`, `${cwd}/package.json`)

          return {
            kind: 'success',
            message: 'Successfully prepared files for a release.'
          }
        } catch (error) {
          return {
            kind: 'failure',
            reason: (error as Error).message
          }
        }
      }
    })
  )
}

main()
