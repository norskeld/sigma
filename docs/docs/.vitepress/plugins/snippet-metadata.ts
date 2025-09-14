import type MarkdownIt from 'markdown-it'
import { readFileSync } from 'fs'
import ts from 'typescript'
import { stringGuard, tokenGuard, type SnippetMetadata, basicTokenGuard } from '../types'
import {
  findFunctionNode,
  extractJSDoc,
  extractDescriptionFromJSDoc,
  extractReturnsTag,
  formatDescription
} from '../utils/typescript-helpers'

/**
 * Custom markdown plugin that enhances snippet functionality with file metadata
 * This plugin processes the <<< syntax and adds file information to code block metadata
 */
export function snippetMetadataPlugin(md: MarkdownIt) {
  // Process tokens after they're all parsed
  md.core.ruler.after('block', 'enhance-snippet-metadata', (state) => {
    const currentFile = state.env.filePath || state.env.relativePath

    if (!stringGuard(currentFile)) {
      return
    }

    const tokens = state.tokens

    for (const token of tokens) {
      // Early return if token doesn't have snippet metadata
      if (!tokenGuard(token)) {
        continue
      }

      const src = token.src.filter(Boolean).at(0)

      // Early return if no src found
      if (!src) {
        continue
      }

      // Extract the file path from the src attribute
      const resolvedPath = Array.isArray(token.src) ? token.src[0] : token.src

      // This is a snippet token processed by VitePress
      const info = token.info || ''
      const [lang, params] = info.split('[')?.map((item) => item.trim().replace(']', ''))

      const functionName = currentFile.split('/').at(-1)?.split('.').at(0)

      // Create enhanced metadata
      const metadata: Partial<SnippetMetadata> = {
        resolvedPath,
        lang,
        params,
        functionName,
        currentFile,
        src
      }

      if (Object.values(metadata).some((v) => v == null)) {
        continue
      }

      const metadataStr = JSON.stringify(metadata)
      token.info = `ts[${functionName}.ts]`
      token.attrSet(metadataStr, metadataStr)
    }
  })

  // Transform description code blocks into formatted paragraphs
  md.core.ruler.push('transform-description-snippets', (state) => {
    for (let i = 0; i < state.tokens.length; i++) {
      const token = state.tokens[i]

      if (!basicTokenGuard(token)) {
        continue
      }

      const metadata = parseMetadata(token)
      if (!metadata || metadata.lang !== 'description') {
        continue
      }

      const transformedTokens = transformDescriptionToken(md, state, metadata, i)
      if (transformedTokens) {
        state.tokens.splice(i, 1, ...transformedTokens)
        i += transformedTokens.length - 1
      }
    }
  })

  function parseMetadata(token: any): SnippetMetadata | null {
    try {
      return JSON.parse(token.attrs![0]![0]!) as SnippetMetadata
    } catch {
      return null
    }
  }

  function extractDescription(
    functionNode: ts.Node,
    functionName: string,
    currentFile: string
  ): string | null {
    const jsDoc = extractJSDoc(functionNode)
    if (!jsDoc) {
      return null
    }

    const description = extractDescriptionFromJSDoc(jsDoc)
    const returnsText = extractReturnsTag(jsDoc)

    return formatDescription(functionName, description, returnsText, currentFile)
  }

  function transformDescriptionToken(
    md: MarkdownIt,
    state: any,
    metadata: SnippetMetadata,
    index: number
  ): any[] | null {
    try {
      const sourceCode = readFileSync(metadata.resolvedPath, 'utf-8')
      const sourceFile = ts.createSourceFile(
        metadata.resolvedPath,
        sourceCode,
        ts.ScriptTarget.Latest,
        true
      )

      const functionNode = findFunctionNode(sourceFile, metadata.functionName)
      if (!functionNode) {
        return null
      }

      const formattedDescription = extractDescription(
        functionNode,
        metadata.functionName,
        metadata.currentFile
      )
      if (!formattedDescription) {
        return null
      }

      const tempTokens = md.parse(formattedDescription, state.env)
      const inlineToken = tempTokens.find((t) => t.type === 'inline')

      if (!inlineToken?.children) {
        return null
      }

      const paragraphOpen = new state.Token('paragraph_open', 'p', 1)
      const paragraphClose = new state.Token('paragraph_close', 'p', -1)

      return [paragraphOpen, inlineToken, paragraphClose]
    } catch (error) {
      console.warn(`Failed to transform description for ${metadata.functionName}:`, error)
      return null
    }
  }
}
