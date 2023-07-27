import { readdirSync } from 'node:fs'
import { dirname, join, parse } from 'node:path'
import { fileURLToPath } from 'node:url'

import frontmatter from 'gray-matter'

import type { DefaultTheme } from 'vitepress'

export function format(...strings: Array<string>): string {
  return strings.join(String())
}

export const Sidebar = {
  group(
    text: string,
    base: string,
    items: Array<DefaultTheme.SidebarItem>
  ): DefaultTheme.SidebarItem {
    return {
      text,
      items: items.map((item) => ({ ...item, link: `${base}/${item.link}` })),
      collapsed: false
    }
  },

  item(text: string, link: string): DefaultTheme.SidebarItem {
    return { text, link }
  }
}

export const Nav = {
  item(text: string, link: string): DefaultTheme.NavItemWithLink {
    return { text, link }
  },

  items(text: string, items: Array<DefaultTheme.NavItemWithLink>): DefaultTheme.NavItem {
    return { text, items }
  }
}

export const Social = {
  item(svg: string, link: string): DefaultTheme.SocialLink {
    return {
      icon: { svg },
      link
    }
  }
}

export type Frontmatter = { title: string }

function getSorting(f: string) {
  // prettier-ignore
  switch (f) {
    case 'introduction': return 0
    case 'guides': return 1
    default: return 2
  }
}

export function capitalize([head, ...raw]: string): string {
  return head.toUpperCase() + String.raw({ raw }).toLowerCase()
}

export const Markdown = {
  getFrontmatter<T extends Record<string, any>>(path: string): T {
    const { data } = frontmatter.read(path)
    return data as T
  }
}

export const Content = {
  getContentDir() {
    const currentDir = dirname(fileURLToPath(import.meta.url))

    return join(currentDir, '..', 'content')
  },

  getContentFolders(contentDir: string) {
    const ignoredDirs = ['.vitepress', 'public']

    return readdirSync(contentDir, { withFileTypes: true })
      .filter((x) => x.isDirectory() && !ignoredDirs.includes(x.name))
      .map((folder) => folder.name)
      .sort((a, b) => getSorting(a) - getSorting(b))
  },

  getItems(docFolder: string) {
    return readdirSync(docFolder).map((filename) => {
      const { name } = parse(filename)

      const { title } = Markdown.getFrontmatter<Frontmatter>(`${docFolder}/${filename}`)

      return Sidebar.item(title, name)
    })
  }
}
