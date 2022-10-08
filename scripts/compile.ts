import { readdir, unlink } from 'fs/promises'

import { rollup, InputOptions, OutputOptions } from 'rollup'
import dts from 'rollup-plugin-dts'

interface BundleOptions {
  input: InputOptions
  output: Array<OutputOptions>
}

function createTypesBundleOptions(entry: string): BundleOptions {
  return {
    input: {
      input: `${entry}.d.ts`,
      plugins: [dts()]
    },
    output: [
      {
        file: `${entry}.d.ts`,
        format: 'esm'
      }
    ]
  }
}

async function compile() {
  try {
    const entries = [
      createTypesBundleOptions('dist/index'),
      createTypesBundleOptions('dist/parsers'),
      createTypesBundleOptions('dist/combinators')
    ]
    await Promise.all(
      entries.map(async ({ input, output }) => {
        const bundle = await rollup(input)

        for (const out of output) {
          await bundle.generate(out)
          await bundle.write(out)
        }

        await bundle.close()
      })
    )
    const distFiles = await readdir('dist')
    await Promise.all(
      distFiles
        .filter(
          (file) =>
            file.endsWith('.d.ts') &&
            !file.startsWith('index') &&
            !file.startsWith('combinators') &&
            !file.startsWith('parsers')
        )
        .map(async (file) => unlink('dist/' + file))
    )
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

compile()
