import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import './custom.css'

export default {
  ...DefaultTheme,

  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)
  },
} satisfies Theme
