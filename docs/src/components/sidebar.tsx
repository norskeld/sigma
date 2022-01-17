import { useState } from 'react'
import Link from 'next/link'
import cx from 'classnames'

import { type SectionNode, type ItemNode } from '@/lib/sidebar'
import { useSidebar } from '@/context/sidebar.context'

import { CaretRightIcon } from './icons'

import styles from './sidebar.module.css'

interface SidebarProps {
  sections: Array<SectionNode>
  path: string
}

interface SidebarSectionProps {
  section: SectionNode
  path: string
}

interface SidebarItemProps {
  item: ItemNode
  path: string
}

function isActive({ url: path }: ItemNode | SectionNode, currentPath: string) {
  return path === currentPath
}

function hasActiveItem({ items }: SectionNode, currentPath: string) {
  return items.some(({ url }) => url === currentPath)
}

export default function Sidebar({ sections, path }: SidebarProps) {
  const [isShowing] = useSidebar()

  return (
    <aside
      className={cx({
        [styles.sidebar]: true,
        [styles.sidebarWithOverlay]: isShowing
      })}
    >
      <div className={styles.container}>
        {sections.map((section, nodeId) => (
          <SidebarSection key={nodeId} section={section} path={path} />
        ))}
      </div>
    </aside>
  )
}

function SidebarSection({ section, path }: SidebarSectionProps) {
  const [isOpen, setIsOpen] = useState(hasActiveItem(section, path))

  const hasDocumentedItems = section.items.some((item) => !item.tbd)

  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle} onClick={() => setIsOpen(hasDocumentedItems && !isOpen)}>
        <div className={styles.sectionTitleLabel}>{section.label}</div>

        {hasDocumentedItems ? (
          <CaretRightIcon
            size={12}
            className={cx({
              [styles.sectionTitleCaret]: true,
              [styles.sectionTitleCaretRotate]: isOpen
            })}
          />
        ) : (
          <ToBeDocumented />
        )}
      </div>

      <div
        className={cx({
          [styles.sectionBody]: true,
          [styles.sectionBodyOpen]: isOpen
        })}
      >
        {section.items.map((item, itemId) => (
          <SidebarItem key={section.label + itemId} item={item} path={path} />
        ))}
      </div>
    </div>
  )
}

function SidebarItem({ item, path }: SidebarItemProps) {
  return (
    <div
      className={cx({
        [styles.item]: true,
        [styles.itemActive]: isActive(item, path)
      })}
    >
      {item.tbd ? (
        <>
          <div className={cx(styles.itemLink, styles.itemLinkDisabled)}>{item.label}</div>
          <ToBeDocumented />
        </>
      ) : (
        <Link href={item.url}>
          <a className={styles.itemLink}>{item.label}</a>
        </Link>
      )}
    </div>
  )
}

function ToBeDocumented() {
  return (
    <div title="To be documented" className={styles.itemTBD}>
      TBD
    </div>
  )
}
