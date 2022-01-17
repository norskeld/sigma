interface AccentProps {
  color?: string
  children: React.ReactNode
}

export default function Accent({ color = 'var(--accent)', children }: AccentProps) {
  return <span style={{ color }}>{children}</span>
}
