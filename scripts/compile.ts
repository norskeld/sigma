import { rollup, InputOptions, OutputOptions } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

interface BundleOptions {
  input: InputOptions
  output: Array<OutputOptions>
}

function createBundleOptions(entry: string, destination: string): BundleOptions {
  return {
    input: {
      input: `${entry}.ts`,
      plugins: [
        typescript({
          module: 'esnext',
          tsconfig: 'tsconfig.rollup.json'
        })
      ]
    },
    output: [
      {
        file: `${destination}.cjs`,
        format: 'cjs',
        sourcemap: true
      },
      {
        file: `${destination}.mjs`,
        format: 'esm',
        sourcemap: true
      }
    ]
  }
}

function createTypesBundleOptions(entry: string, destination: string): BundleOptions {
  return {
    input: {
      input: `${entry}.d.ts`,
      plugins: [dts()]
    },
    output: [
      {
        file: `${destination}.d.ts`,
        format: 'esm'
      }
    ]
  }
}

async function compile() {
  const options = [
    // Roll-up sources.
    createBundleOptions('src/index', 'dist/index'),
    createBundleOptions('src/combinators', 'dist/combinators'),

    // Roll-up already existing d.ts created by `tsc`.
    createTypesBundleOptions('dist/types/index', 'dist/index'),
    createTypesBundleOptions('dist/types/combinators', 'dist/combinators')
  ]

  try {
    await Promise.all(
      options.map(async ({ input, output }) => {
        const bundle = await rollup(input)

        for (const out of output) {
          await bundle.generate(out)
          await bundle.write(out)
        }

        await bundle.close()
      })
    )
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

compile()
