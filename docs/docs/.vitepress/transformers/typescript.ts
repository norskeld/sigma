import ts from 'typescript'
import type { ShikiTransformer } from 'shiki'

import { isSpecialType, type FunctionInfoType, type SnippetMetadata } from '../types'
import {
  parseSnippetMetadata,
  findFunctionNode,
  findFunctionOverloads,
  extractJSDoc,
  extractDescriptionFromJSDoc,
  extractReturnsTag,
  extractExampleTags,
  extractSeeTag,
  formatDescription,
  createCleanFunctionDeclaration
} from '../utils/typescript-helpers'

/**
 * TypeScript code transformer that extracts function information from code blocks
 */
export function createTypeScriptTransformer(): ShikiTransformer {
  return {
    preprocess(code, options) {
      // Try to find snippet metadata
      const snippetData = options.meta?.__raw || ''

      // Early return if no snippet data
      if (!snippetData) {
        return code
      }

      const parsedSnippetData = parseSnippetMetadata(snippetData)

      // Early return if no parsed snippet data
      if (!parsedSnippetData) {
        return code
      }

      // Check if the language is one of our special types
      const lang: string = parsedSnippetData.lang

      // Early return if not a special type
      if (!isSpecialType(lang)) {
        return code
      }

      // Extract function name from the snippet data
      const functionName = parsedSnippetData.functionName
      const type = lang

      // Early return if no function name
      if (!functionName || functionName === 'unknown') {
        throw new Error('Function name is required')
      }

      this.meta = {
        ...this.meta,
        parsedSnippetData
      }
      try {
        const result = extractFunctionInfo(code, functionName, type)
        return result
      } catch (error) {
        console.warn(`Failed to extract ${type} for function '${functionName}': ${error}`)
        return `// Error: Could not extract ${type} for '${functionName}'`
      }
    }
  }
}

/**
 * Extracts function information from TypeScript code
 */
function extractFunctionInfo(code: string, functionName: string, type: FunctionInfoType): string {
  try {
    // Create a virtual file system for TypeScript
    const fileName = 'temp.ts'
    const createdFiles: Record<string, string> = {}

    const options = {
      allowJs: true,
      allowUnreachableCode: true,
      allowUnusedLabels: true,
      declaration: true,
      emitDeclarationOnly: true,
      esModuleInterop: true,
      exactOptionalPropertyTypes: false,
      lib: ['ESNext'],
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.NodeNext,
      target: ts.ScriptTarget.Latest,
      skipLibCheck: true,
      skipDefaultLibCheck: true,
      strict: false
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

    // Extract based on the requested type
    switch (type) {
      case 'signature': {
        // Find all function overloads in the source file (not declaration file)
        const overloads = findFunctionOverloads(sourceFile, functionName)
        if (overloads.length === 0) {
          throw new Error(`Function '${functionName}' not found in the source file`)
        }

        // Create clean versions of all overloads without export/declare modifiers
        const cleanOverloads = overloads.map((overload) => {
          // For all overloads, remove export/declare modifiers and body
          return ts.factory.createFunctionDeclaration(
            overload.modifiers?.filter(
              (mod) =>
                mod.kind !== ts.SyntaxKind.ExportKeyword &&
                mod.kind !== ts.SyntaxKind.DeclareKeyword
            ),
            overload.asteriskToken,
            overload.name,
            overload.typeParameters,
            overload.parameters,
            overload.type,
            undefined // No body for signature display
          )
        })

        // Print all overload signatures
        const printer = ts.createPrinter()
        return cleanOverloads
          .map((overload) => printer.printNode(ts.EmitHint.Unspecified, overload, sourceFile))
          .join('\n')
      }

      case 'description': {
        // Find the original function in the source file to get JSDoc
        const originalNode = findFunctionNode(sourceFile, functionName)
        if (!originalNode) {
          throw new Error(`Function '${functionName}' not found in the source file`)
        }

        const jsDoc = extractJSDoc(originalNode)
        if (!jsDoc) {
          return `// No JSDoc found for '${functionName}'`
        }

        const description = extractDescriptionFromJSDoc(jsDoc)
        const returnsText = extractReturnsTag(jsDoc)

        if (!returnsText) {
          return `// No @returns tag found for '${functionName}'`
        }

        // For description type, we need to modify the token content instead of returning code
        // This will be handled by the markdown-it plugin, so we return the description
        return formatDescription(functionName, description, returnsText, 'combinators/') // Default to combinator for transformer
      }

      case 'jsdoc': {
        // Find the original function in the source file to get full JSDoc
        const originalNode = findFunctionNode(sourceFile, functionName)
        if (!originalNode) {
          throw new Error(`Function '${functionName}' not found in the source file`)
        }

        const jsDoc = extractJSDoc(originalNode)
        if (!jsDoc) {
          return `// No JSDoc found for '${functionName}'`
        }

        const fullText = jsDoc.getFullText(sourceFile)
        return fullText
      }

      case 'example': {
        // Find the original function in the source file to get JSDoc
        const originalNode = findFunctionNode(sourceFile, functionName)
        if (!originalNode) {
          throw new Error(`Function '${functionName}' not found in the source file`)
        }

        const jsDoc = extractJSDoc(originalNode)
        if (!jsDoc) {
          return `// No JSDoc found for '${functionName}'`
        }

        const url = extractSeeTag(jsDoc)
        const examples = extractExampleTags(jsDoc)

        if (examples.length === 0) {
          return `// No @example found for '${functionName}'`
        }

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
