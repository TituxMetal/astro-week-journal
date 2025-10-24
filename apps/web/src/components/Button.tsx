import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonAsButton = ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: 'button'
  href?: never
}

type ButtonAsLink = AnchorHTMLAttributes<HTMLAnchorElement> & {
  as: 'link'
  href: string
}

type ButtonProps = {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
} & (ButtonAsButton | ButtonAsLink)

const variantStyles = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-zinc-700 hover:bg-zinc-600 text-zinc-100',
  danger: 'bg-red-600 hover:bg-red-700 text-white'
}

export const Button = ({
  children,
  variant = 'primary',
  className = '',
  as = 'button',
  ...props
}: ButtonProps) => {
  const baseStyles =
    'cursor-pointer rounded-md px-4 py-2 inline-block text-center disabled:cursor-not-allowed disabled:opacity-50'
  const variantStyle = variantStyles[variant]
  const combinedClassName = `${baseStyles} ${variantStyle} ${className}`

  if (as === 'link') {
    const { href, ...linkProps } = props as ButtonAsLink
    return (
      <a href={href} className={combinedClassName} {...linkProps}>
        {children}
      </a>
    )
  }

  const buttonProps = props as ButtonAsButton
  return (
    <button type='button' className={combinedClassName} {...buttonProps}>
      {children}
    </button>
  )
}
