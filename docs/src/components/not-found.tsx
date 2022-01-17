import { LinkBreakIcon } from './icons'

import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <div className={styles.message}>
        <div className={styles.messageText}>Oh, no! There's no such page. </div>
        <LinkBreakIcon size={40} className={styles.messageIcon} />
      </div>
    </div>
  )
}
