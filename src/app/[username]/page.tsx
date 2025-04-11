type Props = {
  username: string;
}

export default function Page({ username }: Props) {
  return (
    <div>{username}</div>
  );
}

