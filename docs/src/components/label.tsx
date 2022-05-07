import cx from 'classnames'

import styles from './label.module.css'

export interface LabelProps {
  kind: string
}

function getKindData(kind: string): [text: string, hint: string, className: string] {
  switch (kind) {
    case 'composite': {
      return [
        'composite',
        `This parser/combinator is defined using other parsers/combinators.`,
        styles.compound
      ]
    }

    default: {
      return ['primitive', 'This is a low-level parser.', styles.primitive]
    }
  }
}

export default function Label({ kind }: LabelProps) {
  const [kindText, kindHint, kindClassName] = getKindData(kind)

  return (
    <span className={cx(styles.base, kindClassName)} title={kindHint}>
      {kindText}
    </span>
  )
}
