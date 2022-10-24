import type { DefaultTheme } from 'vitepress'

export function format(...strings: Array<string>): string {
  return strings.join(String())
}

export const Sidebar = {
  group(
    text: string,
    base: string,
    items: Array<DefaultTheme.SidebarItem>
  ): DefaultTheme.SidebarGroup {
    const sidebarItems = items.map((item) => ({
      ...item,
      link: base + item.link
    }))

    return {
      text,
      items: sidebarItems,
      collapsed: true,
      collapsible: true
    }
  },

  item(text: string, link: string): DefaultTheme.SidebarItem {
    return { text, link }
  }
}

export const Nav = {
  item(text: string, link: string): DefaultTheme.NavItem {
    return { text, link }
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
