/** Arrow left icon which should be used when one will go back. */
export default function ArrowLeftIcon({
  height = '24px',
  width = '24px',
  ...props
}: Readonly<React.ComponentProps<'svg'>>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height}
      viewBox="0 -960 960 960"
      width={width}
      {...props}
    >
      <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
    </svg>
  )
}
