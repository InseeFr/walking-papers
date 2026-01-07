import { type ErrorComponentProps } from '@tanstack/react-router'

export default function ErrorPage(props: Readonly<ErrorComponentProps>) {
  const { error } = props
  return <div>{`${error.name} : ${error.message}`}</div>
}
