import { Helmet } from "react-helmet";

interface HeadComponentProps {
  title: string;
}

export function HeadComponent({ title }: HeadComponentProps) {
  return (
    <Helmet>
      <title>Letmeask | {title}</title>
    </Helmet>
  )
}