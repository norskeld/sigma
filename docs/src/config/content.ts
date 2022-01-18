/**
 * Directory that contains docs content.
 *
 * **Note**: if changing to something else, don't forget to add it to the `.vercelignore` so it's
 * not ignored, because it ignores everything _except_ specifically allowed files/directories.
 */
export const DOCS_DIR = 'content'

/**
 * Theme to use for syntax highlighting in Shiki.
 *
 * Custom themes (any Visual Studio Code theme will do) reside in `src/syntax/themes` directory.
 */
export const DOCS_SYNTAX_THEME = 'norskeld'

/**
 * Google Analytics ID.
 *
 * Set to any falsy value to disable injection of GA scripts.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA

/** `<username/repository>`. */
export const DOCS_REPO = 'norskeld/sigma'

/** Branch for edit links. */
export const DOCS_BRANCH = 'master'

/** Path in the repository to docs content. */
export const DOCS_PATH = `docs/${DOCS_DIR}`

/** Base for edit links. */
export const DOCS_EDIT_URL = `https://github.com/${DOCS_REPO}/tree/${DOCS_BRANCH}/${DOCS_PATH}`
