export enum ButtonStyle {
  Primary,
  Secondary,
}

export enum ButtonSize {
  sm,
  md,
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonSize?: ButtonSize
  buttonStyle?: ButtonStyle
  children: React.ReactNode
  onClick?: () => void
  /** Icon to be added to the left of the label */
  IconLeft?: React.ReactNode
  /** Icon to be added to the right of the label */
  IconRight?: React.ReactNode
}

export default function Button({
  buttonSize = ButtonSize.md,
  buttonStyle = ButtonStyle.Secondary,
  className = '',
  children,
  disabled = false,
  onClick = () => {},
  IconLeft = null,
  IconRight = null,
  ...props
}: Readonly<ButtonProps>) {
  return (
    <button
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      aria-disabled={disabled}
      className={`${className} border cursor-pointer font-semibold transition rounded disabled:cursor-not-allowed outline-hidden focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary text-nowrap
        ${
          buttonStyle === ButtonStyle.Primary
            ? 'bg-primary text-negative disabled:bg-primary-disabled hover:enabled:bg-primary-accent active:enabled:bg-primary-active'
            : 'bg-white text-primary fill-action-primary disabled:bg-disabled disabled:text-disabled hover:enabled:bg-accent active:enabled:bg-active disabled:border-default border-primary'
        } ${buttonSize === ButtonSize.md ? 'px-4 py-3 min-w-40' : 'px-2 py-1'}`}
      {...props}
    >
      <div className="flex items-center place-content-center">
        {IconLeft}
        <span className="px-2">{children}</span>
        {IconRight}
      </div>
    </button>
  )
}
