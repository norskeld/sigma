import cx from 'classnames'
import { useRouter } from 'next/router'

import { CloseIcon, DotsIcon, GitHubIcon, NpmIcon, type IconProps } from './icons'
import AppLink from './link'

import { useSidebar } from '@/context/sidebar.context'

import styles from './navigation.module.css'

interface DocLinkProps {
  href?: string
  className?: string
  children: React.ReactNode
}

interface IconLinkProps {
  href: string
  className?: string
  icon: (props: IconProps) => JSX.Element
}

export default function Navigation() {
  const [isShowing] = useSidebar()
  const { asPath } = useRouter()

  return (
    <nav
      role="navigation"
      className={cx({
        [styles.navigation]: true,
        [styles.navigationWithOverlay]: isShowing
      })}
    >
      <div className={styles.brand}>
        <AppLink href="/">
          <a className={styles.logo}>Σ</a>
        </AppLink>
      </div>

      <div className={styles.items}>
        <div className={styles.links}>
          <DocLink>Guides</DocLink>
          <DocLink href="/combinators/chainl">Combinators</DocLink>
          <DocLink href="/parsers/defer">Parsers</DocLink>
        </div>

        <div className={styles.icons}>
          <IconLink icon={NpmIcon} href="https://npm.im/@nrsk/sigma" />
          <IconLink icon={GitHubIcon} href="https://github.com/norskeld/sigma" />
        </div>

        {asPath !== '/' && (
          <div className={styles.mobile}>
            <MobileLink />
          </div>
        )}
      </div>
    </nav>
  )
}

function MobileLink() {
  const [isShowing, setIsShowing] = useSidebar()

  return (
    <div className={styles.item} onClick={() => setIsShowing(!isShowing)}>
      <a className={styles.link}>
        {isShowing ? <CloseIcon className={styles.icon} /> : <DotsIcon className={styles.icon} />}
      </a>
    </div>
  )
}

function DocLink({ href, children }: DocLinkProps) {
  return (
    <div className={styles.item}>
      {href ? (
        <AppLink href={href}>
          <a className={styles.link}>{children}</a>
        </AppLink>
      ) : (
        <div className={cx(styles.link, styles.linkDisabled)}>
          {children} <ToBeDocumented />
        </div>
      )}
    </div>
  )
}

function IconLink({ href, icon: Icon }: IconLinkProps) {
  return (
    <div className={cx(styles.item, styles.itemWithIcon)}>
      <AppLink external href={href} className={styles.link}>
        <Icon className={styles.icon} />
      </AppLink>
    </div>
  )
}

function ToBeDocumented() {
  return (
    <span title="To be documented" className={styles.itemTBD}>
      TBD
    </span>
  )
}
