import cx from 'classnames'

import styles from './container.module.css'

interface ContainerProps {
  single?: boolean
  children: React.ReactNode
}

export default function Container({ single = false, children }: ContainerProps) {
  return (
    <main
      className={cx({
        [styles.container]: true,
        [styles.containerSingle]: single
      })}
    >
      {children}
    </main>
  )
}
