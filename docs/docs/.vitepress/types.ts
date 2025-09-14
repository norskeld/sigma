import type MarkdownIt from 'markdown-it'

export type FunctionInfoType = 'signature' | 'description' | 'jsdoc' | 'example'

export const SPECIAL_TYPES = ['signature', 'description', 'jsdoc', 'example'] as const
export type SpecialType = typeof SPECIAL_TYPES[number]

export type MarkdownItToken = ReturnType<MarkdownIt['parse']>[number]

export type Token = MarkdownItToken & {
  src: string[]
}

export interface SnippetMetadata {
  filePath: string
  resolvedPath: string
  lang: string
  params: string
  functionName: string
  currentFile: string
  src: string
}

export const basicTokenGuard = (token: MarkdownItToken | undefined): token is Token => {
  return Boolean(token)
}

export const tokenGuard = (token: MarkdownItToken | undefined): token is Token => {
  if (!token || token.type !== 'fence') {
    return false
  }

  return 'src' in token
}

export const isSpecialType = (type: string | undefined): type is SpecialType => {
  return SPECIAL_TYPES.includes(type as SpecialType)
}

export const stringGuard = (str: any): str is string => {
  return typeof str === 'string'
}
