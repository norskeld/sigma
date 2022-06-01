import cx from 'classnames'
import Link, { type LinkProps } from 'next/link'

import styles from './link.module.css'

interface AppLinkProps extends LinkProps {
  blank?: boolean
  title?: string
  external?: boolean
  className?: string
  children: React.ReactNode
}

interface ExternalLinkProps {
  href: string
  blank?: boolean
  title?: string
  className?: string
  children: React.ReactNode
}

function isExternalLink(href: unknown, external?: boolean) {
  return Boolean(external) && typeof href === 'string'
}

export function ExternalLink({ href, blank, title, className, children }: ExternalLinkProps) {
  const options = {
    href,
    title,
    className: cx(styles.link, className)
  }

  const props = blank
    ? { ...options, target: '_blank', rel: 'noopener noreferrer' }
    : { ...options, target: '_self' }

  return <a {...props}>{children}</a>
}

export function AppLink({
  href,
  blank,
  external,
  title,
  children,
  className,
  ...rest
}: AppLinkProps) {
  const props = { ...rest, href, title }

  return isExternalLink(href, external) ? (
    <ExternalLink blank={blank} href={href as string} title={title} className={className}>
      {children}
    </ExternalLink>
  ) : (
    <Link {...props}>{children}</Link>
  )
}

export default AppLink
