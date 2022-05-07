import { format, formatDistanceToNow, parseISO } from 'date-fns'

import AppLink from './link'

import styles from './article.module.css'

export interface ArticleProps {
  title: string
  content: string
  editUrl: string
  lastChange: string
  label: React.ReactNode
}

export default function Article({
  title,
  content,
  editUrl,
  lastChange,
  label = null
}: ArticleProps) {
  const time = parseISO(lastChange)
  const timeHumanReadable = format(time, 'd/MM/y, HH:mm:ss')
  const timeDistance = formatDistanceToNow(time)

  return (
    <>
      <section className={styles.article}>
        <h1>
          {title} {label}
        </h1>

        <article dangerouslySetInnerHTML={{ __html: content }} />
      </section>

      <footer className={styles.footer}>
        <time dateTime={lastChange} title={timeHumanReadable} className={styles.footerLastChange}>
          Last change: {timeDistance} ago
        </time>

        <div className={styles.footerEdit}>
          <AppLink external href={editUrl}>
            Edit this page on GitHub
          </AppLink>
        </div>
      </footer>
    </>
  )
}
