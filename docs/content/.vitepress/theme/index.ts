import DefaultTheme from 'vitepress/theme'

import './custom.css'

import { Composite, Primitive } from './components/Type'

export default <typeof DefaultTheme>{
  ...DefaultTheme,

  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)
    ctx.app.component('Composite', Composite)
    ctx.app.component('Primitive', Primitive)
  }
}
