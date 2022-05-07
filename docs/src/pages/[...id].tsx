import type { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

import {
  getEntry,
  getEntriesId,
  getEntryEditLink,
  getEntryLastChange,
  type Entry
} from '@/lib/entries'
import { getSidebarItems, type SectionNode } from '@/lib/sidebar'
import { Common } from '@/config/seo'

import Navigation from '@/components/navigation'
import Container from '@/components/container'
import Article from '@/components/article'
import Sidebar from '@/components/sidebar'
import Content from '@/components/content'
import Footer from '@/components/footer'
import Label from '@/components/label'

interface Props {
  article: Entry
  articleEditUrl: string
  articleLastChange: string
  sections: Array<SectionNode>
}

export default function ({ article, sections, articleEditUrl, articleLastChange }: Props) {
  const { title, content, description, section, kind } = article
  const { asPath } = useRouter()

  const url = Common.host + asPath
  const fullTitle = section ? `${section} ${Common.separator} ${title}` : `${title}`

  return (
    <>
      <NextSeo
        title={fullTitle}
        canonical={url}
        description={description ?? title}
        openGraph={{
          type: 'article',
          title: fullTitle,
          description: description ?? title,
          url
        }}
      />

      <Navigation />

      <Container>
        <Sidebar sections={sections} path={asPath} />

        <Content>
          <Article
            title={title}
            content={content}
            editUrl={articleEditUrl}
            lastChange={articleLastChange}
            label={kind && <Label kind={kind} />}
          />
        </Content>
      </Container>

      <Footer />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getEntriesId()

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const rawIds = params?.id ?? []
  const preparedIds = (rawIds as Array<string>).join('/')

  const article = await getEntry(preparedIds)
  const articleLastChange = await getEntryLastChange(preparedIds)
  const articleEditUrl = getEntryEditLink(preparedIds)
  const sections = getSidebarItems()

  return {
    props: {
      article,
      articleEditUrl,
      articleLastChange,
      sections
    }
  }
}
