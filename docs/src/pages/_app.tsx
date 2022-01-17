import { type AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'

import { GA_ID } from '@/config/content'
import { Seo } from '@/config/seo'

import '@/styles/constraints.css'
import '@/styles/typography.css'
import '@/styles/colors.css'
import '@/styles/reset.css'
import '@/styles/global.css'

import WithRouterEvents from '@/components/with-router-events'
import GoogleAnalytics from '@/components/analytics'
import Wrapper from '@/components/wrapper'

import { SidebarProvider } from '@/context/sidebar.context'

export default function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...Seo} />

      <SidebarProvider>
        <WithRouterEvents>
          <Wrapper>
            <Component {...pageProps} />
          </Wrapper>
        </WithRouterEvents>
      </SidebarProvider>

      <GoogleAnalytics id={GA_ID} />
    </>
  )
}
