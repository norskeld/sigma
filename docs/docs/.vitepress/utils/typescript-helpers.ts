import ts from 'typescript'
import type { SnippetMetadata } from '../types'

/**
 * Parses snippet metadata from a JSON string
 */
export function parseSnippetMetadata(snippetData: string): SnippetMetadata | null {
  try {
    return JSON.parse(snippetData)
  } catch {
    return null
  }
}

/**
 * Finds a function node by name in a TypeScript source file
 */
export function findFunctionNode(sourceFile: ts.SourceFile, functionName: string): ts.Node | null {
  let functionNode: ts.Node | null = null

  ts.forEachChild(sourceFile, (node) => {
    const name = getNodeName(node)
    if (name === functionName) {
      functionNode = node
    }
  })

  return functionNode
}

/**
 * Finds all function overloads by name in a TypeScript source file
 */
export function findFunctionOverloads(
  sourceFile: ts.SourceFile,
  functionName: string
): ts.FunctionDeclaration[] {
  const overloads: ts.FunctionDeclaration[] = []

  ts.forEachChild(sourceFile, (node) => {
    if (ts.isFunctionDeclaration(node) && node.name?.text === functionName) {
      overloads.push(node)
    }
  })

  return overloads
}

/**
 * Extracts the name from a TypeScript AST node
 */
export function getNodeName(node: ts.Node): string {
  if (ts.isFunctionDeclaration(node)) {
    return node.name?.text || ''
  }

  if (ts.isVariableStatement(node)) {
    const declaration = node.declarationList.declarations[0]
    return declaration && ts.isIdentifier(declaration.name) ? declaration.name.text : ''
  }

  if (ts.isInterfaceDeclaration(node)) {
    return node.name.text
  }

  return ''
}

/**
 * Extracts JSDoc comment from a function node
 */
export function extractJSDoc(functionNode: ts.Node): ts.JSDoc | null {
  return ((functionNode as any).jsDoc?.[0] as ts.JSDoc | undefined) || null
}

/**
 * Extracts description text from JSDoc
 */
export function extractDescriptionFromJSDoc(jsDoc: ts.JSDoc): string {
  return (jsDoc.comment as string) || ''
}

/**
 * Extracts @returns tag from JSDoc
 */
export function extractReturnsTag(jsDoc: ts.JSDoc): string {
  const returnsTag = jsDoc.tags?.find((tag: any) => tag.tagName.text === 'returns')
  return returnsTag?.comment ? (returnsTag.comment as string).trim() : ''
}

/**
 * Extracts @example tags from JSDoc
 */
export function extractExampleTags(jsDoc: ts.JSDoc): string[] {
  const exampleTags = jsDoc.tags?.filter((tag) => tag.tagName.text === 'example') || []

  return exampleTags
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
}

/**
 * Extracts @see tag from JSDoc
 */
export function extractSeeTag(jsDoc: ts.JSDoc): string | undefined {
  const seeTag = jsDoc.tags?.find((tag: any) => tag.tagName.text === 'see')
  if (!seeTag?.comment) {
    return undefined
  }

  if (typeof seeTag.comment === 'string') {
    return seeTag.comment.trim()
  }

  return seeTag.comment
    ?.find(ts.isJSDocLink)
    ?.text?.split(' ')
    ?.at(0)
    ?.split('/sigma.nrsk.dev')
    ?.at(1)
    ?.split('/')
    ?.at(-1)
}

/**
 * Determines if a function is a combinator or parser based on file path
 */
export function getFunctionType(currentFile: string): 'combinator' | 'parser' {
  return currentFile.includes('combinator') ? 'combinator' : 'parser'
}

/**
 * Formats a description with function name, type, and returns information
 */
export function formatDescription(
  functionName: string,
  description: string,
  returnsText: string,
  currentFile: string
): string {
  const type = getFunctionType(currentFile)

  if (!returnsText) {
    return `\`${functionName}\` ${type} ${description.toLowerCase()}`
  }

  const [firstWord, ...rest] = returnsText.split(' ')
  if (!firstWord) {
    return `\`${functionName}\` ${type} ${description.toLowerCase()}`
  }

  const returnsSentence = rest.join(' ')
  return `\`${functionName}\` ${type} ${description.toLowerCase()}. Returns a ${firstWord.toLowerCase()} ${returnsSentence}`
}

/**
 * Creates a clean function declaration without export/declare modifiers
 */
export function createCleanFunctionDeclaration(
  node: ts.FunctionDeclaration
): ts.FunctionDeclaration {
  return ts.factory.createFunctionDeclaration(
    node.modifiers?.filter(
      (mod) => mod.kind !== ts.SyntaxKind.ExportKeyword && mod.kind !== ts.SyntaxKind.DeclareKeyword
    ),
    node.asteriskToken,
    node.name,
    node.typeParameters,
    node.parameters,
    node.type,
    node.body
  )
}
