import Navigation from '@/components/navigation'
import Container from '@/components/container'
import Content from '@/components/content'
import Landing from '@/components/landing'
import Footer from '@/components/footer'

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
