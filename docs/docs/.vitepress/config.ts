import type { DefaultTheme, HeadConfig, MarkdownOptions } from 'vitepress'
import { defineConfig } from 'vitepress'
import ts from 'typescript'

import pkg from '../../../package.json'

import { capitalize, Content, format, Nav, Sidebar, Social } from './helpers'
import { Github, Npm } from './icons'

const GH_URL = 'https://github.com/norskeld/sigma'
const NPM_URL = 'https://npm.im/@nrsk/sigma'

export default defineConfig({
  lang: 'en-US',
  title: 'Sigma',
  titleTemplate: false,
  description: 'TypeScript parser combinator library for building fast and convenient parsers.',

  lastUpdated: true,

  outDir: '../dist',
  srcDir: './content',
  cacheDir: '../cache',

  cleanUrls: true,

  head: getHeadConfig(),
  markdown: getMarkdownConfig(),
  themeConfig: getThemeConfig(),

  vite: {
    resolve: {
      alias: {
        '@': '../../src',
        '@combinators': '../../src/combinators',
        '@core': '../../src/core',
        '@lib': '../../src',
        '@parsers': '../../src/parsers',
        '@types': '../../src/types',
        '@utils': '../../src/utils'
      }
    }
  }
})
function getHeadConfig(): Array<HeadConfig> {
  return [
    // Additional link tags.
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/favicon/apple-touch-icon.png'
      }
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon/favicon-32x32.png'
      }
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon/favicon-16x16.png'
      }
    ],
    [
      'link',
      {
        rel: 'mask-icon',
        color: '#5bbad5',
        href: '/favicon/safari-pinned-tab.svg'
      }
    ],
    [
      'link',
      {
        rel: 'manifest',
        href: '/favicon/site.webmanifest'
      }
    ],
    // Additional meta tags.
    [
      'meta',
      {
        name: 'theme-color',
        content: '#ffffff'
      }
    ],
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      }
    ]
  ]
}

type FunctionInfoType = 'signature' | 'description' | 'jsdoc' | 'example'

function getMarkdownConfig(): MarkdownOptions {
  return {
    theme: 'nord',
    languageAlias: {
      'signature,': 'ts',
      'jsdoc,': 'ts',
      'description,': 'ts',
      'example,': 'ts'
    },
    codeTransformers: [
      {
        name: 'typescript-type-checker',
        preprocess(code, options) {
          const language = options.lang || ''

          if (language.includes(',')) {
            options.lang = 'ts'

            const lang = language.split(',')[0] || 'signature'

            const meta = options.meta?.__raw || ''
            const [functionName, type = lang] = meta.split(',')

            if (!functionName) {
              throw new Error('Function name is required')
            }
            try {
              const result = extractFunctionInfo(code, functionName, type as FunctionInfoType)
              return result
            } catch (error) {
              console.warn(`Failed to extract ${type} for function '${functionName}': ${error}`)
              return `// Error: Could not extract ${type} for '${functionName}'`
            }
          }

          return code
        }
      }
    ]
  }
}

function extractFunctionInfo(code: string, functionName: string, type: FunctionInfoType): string {
  try {
    // Create a virtual file system for TypeScript
    const fileName = 'temp.ts'
    const createdFiles: Record<string, string> = {}

    const options = {
      allowJs: true,
      declaration: true,
      emitDeclarationOnly: true,
      target: ts.ScriptTarget.Latest,
      module: ts.ModuleKind.ESNext,
      strict: false,
      esModuleInterop: true,
      skipLibCheck: true,
      removeComments: false, // Keep comments for JSDoc extraction
      moduleResolution: ts.ModuleResolutionKind.NodeNext,
      noImplicitAny: false,
      noImplicitReturns: false,
      noImplicitThis: false,
      noUnusedLocals: false,
      noUnusedParameters: false,
      allowUnreachableCode: true,
      allowUnusedLabels: true,
      noFallthroughCasesInSwitch: false,
      noImplicitOverride: false,
      noPropertyAccessFromIndexSignature: false,
      noUncheckedIndexedAccess: false,
      exactOptionalPropertyTypes: false,
      noImplicitUsed: false,
      noErrorTruncation: true,
      lib: ['ES2022'],
      types: []
    }

    const host = ts.createCompilerHost(options)

    // Override the file system methods to work in memory
    host.writeFile = (fileName: string, contents: string) => {
      createdFiles[fileName] = contents
    }

    host.getSourceFile = (requestedFileName: string, languageVersion: ts.ScriptTarget) => {
      if (requestedFileName === fileName) {
        return ts.createSourceFile(requestedFileName, code, languageVersion, true)
      }
      return undefined
    }

    host.fileExists = (requestedFileName: string) => requestedFileName === fileName

    host.readFile = (requestedFileName: string) =>
      requestedFileName === fileName ? code : undefined

    // Create program and emit declarations
    const program = ts.createProgram([fileName], options, host)
    program.emit()

    const sourceFile = program.getSourceFile(fileName)
    if (!sourceFile) {
      throw new Error('Failed to get source file')
    }

    const dtsFileName = fileName.replace('.ts', '.d.ts')
    const declarationContent = createdFiles[dtsFileName]

    if (!declarationContent) {
      throw new Error('Failed to generate declaration file')
    }

    // Parse the generated .d.ts file
    const dtsSourceFile = ts.createSourceFile(
      dtsFileName,
      declarationContent,
      ts.ScriptTarget.ESNext
    )

    // Find the specific function in the declaration file
    let targetNode: ts.Node | undefined

    ts.forEachChild(dtsSourceFile, (node) => {
      let name = ''

      if (ts.isFunctionDeclaration(node)) {
        name = node.name?.text || ''
      } else if (ts.isVariableStatement(node)) {
        const declaration = node.declarationList.declarations[0]
        if (declaration && ts.isIdentifier(declaration.name)) {
          name = declaration.name.text
        }
      } else if (ts.isInterfaceDeclaration(node)) {
        name = node.name.text
      }

      if (name === functionName) {
        // Create a clean version of the node without export/declare modifiers
        if (ts.isFunctionDeclaration(node)) {
          targetNode = ts.factory.createFunctionDeclaration(
            node.modifiers?.filter(
              (mod) =>
                mod.kind !== ts.SyntaxKind.ExportKeyword &&
                mod.kind !== ts.SyntaxKind.DeclareKeyword
            ),
            node.asteriskToken,
            node.name,
            node.typeParameters,
            node.parameters,
            node.type,
            node.body
          )
        } else {
          targetNode = node
        }
      }
    })

    if (!targetNode) {
      throw new Error(`Function '${functionName}' not found in the declaration file`)
    }

    // Extract based on the requested type
    switch (type) {
      case 'signature': {
        // Use the printer to get the text from the AST node
        const printer = ts.createPrinter()
        const signature = printer.printNode(ts.EmitHint.Unspecified, targetNode, dtsSourceFile)
        return signature
      }

      case 'description': {
        // Find the original function in the source file to get JSDoc
        let originalNode: ts.Node | undefined

        ts.forEachChild(sourceFile, (node) => {
          let name = ''

          if (ts.isFunctionDeclaration(node)) {
            name = node.name?.text || ''
          } else if (ts.isVariableStatement(node)) {
            const declaration = node.declarationList.declarations[0]
            if (declaration && ts.isIdentifier(declaration.name)) {
              name = declaration.name.text
            }
          }

          if (name === functionName) {
            originalNode = node
          }
        })

        if (!originalNode) {
          throw new Error(`Function '${functionName}' not found in the source file`)
        }

        // Extract JSDoc comment
        const jsDoc = (originalNode as any).jsDoc?.[0] as ts.JSDoc | undefined
        const description = (jsDoc?.comment as string) || ''

        return description
      }

      case 'jsdoc': {
        // Find the original function in the source file to get full JSDoc
        let originalNode: ts.Node | undefined

        ts.forEachChild(sourceFile, (node) => {
          let name = ''

          if (ts.isFunctionDeclaration(node)) {
            name = node.name?.text || ''
          } else if (ts.isVariableStatement(node)) {
            const declaration = node.declarationList.declarations[0]
            if (declaration && ts.isIdentifier(declaration.name)) {
              name = declaration.name.text
            }
          }

          if (name === functionName) {
            originalNode = node
          }
        })

        if (!originalNode) {
          throw new Error(`Function '${functionName}' not found in the source file`)
        }

        // Extract full JSDoc
        const jsDoc = (originalNode as any).jsDoc?.[0] as ts.JSDoc | undefined
        if (!jsDoc) {
          return `// No JSDoc found for '${functionName}'`
        }

        const fullText = jsDoc.getFullText(sourceFile)
        return fullText
      }

      case 'example': {
        // Find the original function in the source file to get JSDoc
        let originalNode: ts.Node | undefined

        ts.forEachChild(sourceFile, (node) => {
          let name = ''

          if (ts.isFunctionDeclaration(node)) {
            name = node.name?.text || ''
          } else if (ts.isVariableStatement(node)) {
            const declaration = node.declarationList.declarations[0]
            if (declaration && ts.isIdentifier(declaration.name)) {
              name = declaration.name.text
            }
          }

          if (name === functionName) {
            originalNode = node
          }
        })

        if (!originalNode) {
          throw new Error(`Function '${functionName}' not found in the source file`)
        }

        // Extract @example tags from JSDoc
        const jsDoc = (originalNode as any).jsDoc?.[0] as ts.JSDoc | undefined
        if (!jsDoc) {
          return `// No JSDoc found for '${functionName}'`
        }

        const exampleTags = jsDoc.tags?.filter((tag) => tag.tagName.text === 'example') || []

        if (exampleTags.length === 0) {
          return `// No @example found for '${functionName}'`
        }

        // Extract the text content from @example tags using AST
        const examples = exampleTags
          .map((tag) => {
            // Get the comment text directly from the AST
            const comment = (tag as any).comment as string | undefined
            if (comment) {
              return comment.trim()
            }

            // Fallback: if comment is not available, extract from the tag's children
            const children = (tag as any).children as ts.Node[] | undefined
            if (children) {
              return children
                .filter((child) => child.kind === ts.SyntaxKind.JSDocText)
                .map((child) => (child as any).text)
                .join('')
                .trim()
            }

            return ''
          })
          .filter((example) => example.length > 0)

        return examples.join('\n\n')
      }

      default:
        throw new Error(`Unknown type: ${type}`)
    }
  } catch (error) {
    console.warn(`TypeScript compilation failed: ${error}`)
    return code
  }
}

function getThemeConfig(): DefaultTheme.Config {
  return {
    logo: {
      light: '/images/logo-light.svg',
      dark: '/images/logo-dark.svg'
    },

    editLink: {
      text: 'Edit this page on GitHub',
      pattern: `${GH_URL}/edit/master/docs/docs/content/:path`
    },

    nav: getNav(),
    footer: getFooter(),
    sidebar: getSidebar(),
    socialLinks: getSocialLinks(),

    search: {
      provider: 'local'
    }
  }
}

function getNav() {
  const items = getSidebar().flatMap((item) => item.items ?? [])

  const [core] = items.filter((item) => item.link?.startsWith('/core') ?? false)
  const [combinators] = items.filter((item) => item.link?.startsWith('/combinators') ?? false)
  const [parsers] = items.filter((item) => item.link?.startsWith('/parsers') ?? false)

  if (!core || !combinators || !parsers) {
    throw new Error('Core, combinators and parsers must be defined')
  }

  return [
    Nav.item('Core', core.link!),
    Nav.item('Combinators', combinators.link!),
    Nav.item('Parsers', parsers.link!),
    Nav.items(pkg.version, [Nav.item('Changelog', GH_URL + '/blob/master/CHANGELOG.md')])
  ]
}

function getSocialLinks() {
  return [Social.item(Github, GH_URL), Social.item(Npm, NPM_URL)]
}

function getSidebar() {
  const contentDir = Content.getContentDir()

  return Content.getContentFolders(contentDir).map((folder) =>
    Sidebar.group(capitalize(folder), `/${folder}`, Content.getItems(`${contentDir}/${folder}`))
  )
}

function getFooter() {
  return {
    message: format(
      `Built with <a href="https://vitepress.vuejs.org/">VitePress</a>`,
      ` &middot; `,
      `<a href="${GH_URL}/tree/master/docs">Source code</a>`
    ),

    copyright: format(
      `&copy; 2021-present`,
      ` &middot; `,
      `Licensed under <a href="${GH_URL}/blob/master/LICENSE">MIT</a>`
    )
  }
}
