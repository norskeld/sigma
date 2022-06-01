import Accent from './accent'
import CopyText from './copy'
import { CopyIcon } from './icons'
import AppLink from './link'

import styles from './landing.module.css'

export default function Landing() {
  return (
    <div className={styles.landing}>
      <div className={styles.headline}>
        <h1>
          Parser combinator library for building <Accent>fast</Accent> and{' '}
          <Accent>convenient</Accent> parsers.
        </h1>
      </div>

      <div className={styles.buttons}>
        <AppLink href="/introduction/installation">
          <a className={styles.buttonsRead}>Documentation</a>
        </AppLink>

        <CopyText
          text="npm i @nrsk/sigma"
          containerClassName={styles.buttonsCopy}
          labelClassName={styles.buttonsCopyText}
          iconClassName={styles.buttonsCopyIcon}
          icon={CopyIcon}
        />
      </div>
    </div>
  )
}
