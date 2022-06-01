import Container from '@/components/container'
import Content from '@/components/content'
import Navigation from '@/components/navigation'
import NotFound from '@/components/not-found'

export default function Custom404() {
  return (
    <>
      <Navigation />

      <Container single>
        <Content>
          <NotFound />
        </Content>
      </Container>
    </>
  )
}
