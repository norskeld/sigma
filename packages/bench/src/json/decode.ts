const Escapes: Record<string, string> = {
  '"': '"',
  '\\': '\\',
  '/': '/',
  b: '\b',
  f: '\f',
  n: '\n',
  r: '\r',
  t: '\t',
}

/** Decodes JSON escape sequences in a string with the quotes already stripped. */
export function decode(raw: string): string {
  if (!raw.includes('\\')) {
    return raw
  }

  return raw.replace(/\\(u[0-9a-fA-F]{4}|.)/g, (_, esc: string) => {
    return esc.length === 1
      ? (Escapes[esc] ?? esc)
      : String.fromCharCode(parseInt(esc.slice(1), 16))
  })
}
