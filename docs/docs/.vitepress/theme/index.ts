import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import './custom.css'

import { Composite, Primitive } from './components/Type'

export default {
  ...DefaultTheme,

  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)
    ctx.app.component('Composite', Composite)
    ctx.app.component('Primitive', Primitive)
  }
} satisfies Theme
