import { useRouter } from 'next/router'
import cx from 'classnames'

import styles from './wrapper.module.css'

interface WrapperProps {
  children: React.ReactNode
}

export default function Wrapper({ children }: WrapperProps) {
  const { asPath } = useRouter()

  return (
    <div className={cx({ [styles.wrapper]: true, [styles.wrapperLanding]: asPath === '/' })}>
      {children}
    </div>
  )
}
