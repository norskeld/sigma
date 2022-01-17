import Navigation from '@/components/navigation'
import Container from '@/components/container'
import NotFound from '@/components/not-found'
import Content from '@/components/content'

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
