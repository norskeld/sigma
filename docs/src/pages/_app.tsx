import { DefaultSeo } from 'next-seo'
import { type AppProps } from 'next/app'

import GoogleAnalytics from '@/components/analytics'
import WithRouterEvents from '@/components/with-router-events'
import Wrapper from '@/components/wrapper'
import { GA_ID } from '@/config/content'
import { Seo } from '@/config/seo'
import { SidebarProvider } from '@/context/sidebar.context'

import '@/styles/constraints.css'
import '@/styles/typography.css'
import '@/styles/colors.css'
import '@/styles/reset.css'
import '@/styles/global.css'

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
