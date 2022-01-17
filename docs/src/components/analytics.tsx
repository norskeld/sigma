import Script from 'next/script'

interface GoogleAnalyticsProps {
  id?: string
}

function isValidAnalyticsId(id?: string) {
  return typeof id === 'string' && id.length
}

export default function GoogleAnalytics({ id }: GoogleAnalyticsProps) {
  return isValidAnalyticsId(id) ? (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
      />

      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag() {window.dataLayer.push(arguments);}

          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  ) : null
}
