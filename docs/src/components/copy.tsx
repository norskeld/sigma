import cx from 'classnames'
import { useState } from 'react'

import { type IconProps } from './icons'

interface CopyTextProps {
  text: string
  label?: string
  iconClassName?: string
  labelClassName?: string
  containerClassName?: string
  icon?: (props: IconProps) => JSX.Element
}

async function copyTextToClipboard(text: string) {
  return 'clipboard' in navigator
    ? await navigator.clipboard.writeText(text)
    : document.execCommand('copy', true, text)
}

export default function CopyText({ text, ...optionals }: CopyTextProps) {
  const [isCopied, setIsCopied] = useState(false)
  const Icon = optionals.icon ?? null

  const handleCopyClick = () => {
    copyTextToClipboard(text)
      .then(() => setIsCopied(true))
      .catch((error) => console.error(error))
  }

  return (
    <div className={cx(optionals.containerClassName)} onClick={handleCopyClick}>
      <span className={cx(optionals.labelClassName)}>
        {isCopied ? 'Copied!' : optionals.label ?? text}
      </span>

      {Icon && <Icon className={optionals.iconClassName} />}
    </div>
  )
}
