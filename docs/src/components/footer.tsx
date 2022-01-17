import AppLink from './link'

import styles from './footer.module.css'

interface FooterItemProps {
  children: React.ReactNode
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const LicenseLink = () => (
    <AppLink external href="https://github.com/norskeld/sigma/blob/master/LICENSE">
      MIT
    </AppLink>
  )

  const NextJsLink = () => (
    <AppLink external blank href="https://nextjs.org/">
      Next.js
    </AppLink>
  )

  return (
    <footer className={styles.footer}>
      <FooterItem>&copy; 2021&ndash;{currentYear}</FooterItem>

      <FooterDot />

      <FooterItem>
        Licensed under <LicenseLink />
      </FooterItem>

      <FooterDot />

      <FooterItem>
        Built with <NextJsLink />
      </FooterItem>
    </footer>
  )
}

function FooterItem({ children }: FooterItemProps) {
  return <span className={styles.footerItem}>{children}</span>
}

function FooterDot() {
  return <span className={styles.footerDot}>&middot;</span>
}
