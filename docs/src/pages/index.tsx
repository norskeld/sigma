import Container from '@/components/container'
import Content from '@/components/content'
import Footer from '@/components/footer'
import Landing from '@/components/landing'
import Navigation from '@/components/navigation'

export default function () {
  return (
    <>
      <Navigation />

      <Container single>
        <Content>
          <Landing />
        </Content>
      </Container>

      <Footer />
    </>
  )
}
