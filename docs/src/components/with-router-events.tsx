import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useSidebar } from '@/context/sidebar.context'

interface WithRouterEventsProps {
  children: React.ReactNode
}

export default function WithRouterEvents({ children }: WithRouterEventsProps) {
  const [_, setIsShowing] = useSidebar()
  const router = useRouter()

  useEffect(() => {
    const closeSidebar = () => setIsShowing(false)

    router.events.on('routeChangeComplete', closeSidebar)
    router.events.on('routeChangeError', closeSidebar)

    return () => {
      router.events.off('routeChangeComplete', closeSidebar)
      router.events.off('routeChangeError', closeSidebar)
    }
  }, [router])

  return <>{children}</>
}
