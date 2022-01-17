import styles from './content.module.css'

interface ContentProps {
  children: React.ReactNode
}

export default function Content({ children }: ContentProps) {
  return <section className={styles.content}>{children}</section>
}
