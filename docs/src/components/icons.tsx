export interface IconProps {
  color?: string
  size?: number
  className?: string
}

export function GitHubIcon({ color = 'currentColor', size = 24, className }: IconProps) {
  return (
    <svg
      role="img"
      width={size}
      height={size}
      className={className}
      fill={color}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>GitHub</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

export function NpmIcon({ color = 'currentColor', size = 24, className }: IconProps) {
  return (
    <svg
      role="img"
      width={size}
      height={size}
      className={className}
      fill={color}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>npm</title>
      <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
    </svg>
  )
}

export function DotsIcon({ color = 'currentColor', size = 24, className }: IconProps) {
  return (
    <svg
      role="img"
      width={size}
      height={size}
      className={className}
      fill={color}
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="128" cy="128" r="16"></circle>
      <circle cx="64" cy="128" r="16"></circle>
      <circle cx="192" cy="128" r="16"></circle>
    </svg>
  )
}

export function CloseIcon({ color = 'currentColor', size = 24, className }: IconProps) {
  return (
    <svg
      role="img"
      width={size}
      height={size}
      className={className}
      stroke={color}
      fill="none"
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="200"
        y1="56"
        x2="56"
        y2="200"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      ></line>
      <line
        x1="200"
        y1="200"
        x2="56"
        y2="56"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      ></line>
    </svg>
  )
}

export function CopyIcon({ color = 'currentColor', size = 24, className }: IconProps) {
  return (
    <svg
      role="img"
      width={size}
      height={size}
      className={className}
      stroke={color}
      fill="none"
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polyline
        points="220 176 220 36 80 36"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      ></polyline>
      <rect
        x="40"
        y="76"
        width="140"
        height="140"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      ></rect>
    </svg>
  )
}

export function LinkBreakIcon({ color = 'currentColor', size = 24, className }: IconProps) {
  return (
    <svg
      role="img"
      width={size}
      height={size}
      className={className}
      stroke={color}
      fill="none"
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="96"
        y1="68"
        x2="96"
        y2="48"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      ></line>
      <line
        x1="160"
        y1="208"
        x2="160"
        y2="188"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      ></line>
      <line
        x1="68"
        y1="96"
        x2="48"
        y2="96"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      ></line>
      <line
        x1="208"
        y1="160"
        x2="188"
        y2="160"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      ></line>
      <path
        d="M67,132.4l-7.3,7.3a40,40,0,0,0,56.6,56.6l7.3-7.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      ></path>
      <path
        d="M189,123.6l7.3-7.3a40,40,0,0,0-56.6-56.6L132.4,67"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      ></path>
    </svg>
  )
}

export function CaretRightIcon({ color = 'currentColor', size = 24, className }: IconProps) {
  return (
    <svg
      role="img"
      width={size}
      height={size}
      className={className}
      stroke={color}
      fill="none"
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
        d="m96 48 80 80-80 80"
      />
    </svg>
  )
}
