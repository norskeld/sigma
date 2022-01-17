import {
  createContext,
  useContext,
  useState,
  useMemo,
  type Dispatch,
  type SetStateAction
} from 'react'

type SidebarContext = [isShowing: boolean, setIsShowing: Dispatch<SetStateAction<boolean>>]

interface SidebarProviderProps {
  children: React.ReactNode
}

const SidebarCtx = createContext<SidebarContext | null>(null)

function SidebarProvider(props: SidebarProviderProps) {
  const [isShowing, setIsShowing] = useState(false)
  const value = useMemo(() => [isShowing, setIsShowing] as SidebarContext, [isShowing])

  return <SidebarCtx.Provider value={value} {...props} />
}

function useSidebar() {
  const ctx = useContext(SidebarCtx)

  if (ctx === null) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }

  return ctx
}

export { useSidebar, SidebarProvider }
