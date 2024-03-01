interface Props {
  children: React.ReactNode;
}

export default function EditorLayout({ children }: Props) {
  return <div>{children}</div>;
}
