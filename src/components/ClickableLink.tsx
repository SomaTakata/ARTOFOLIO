import { useCallback, ReactNode } from "react";

type Props = {
  url: string;
  position?: [number,number,number],
  children: ReactNode
}

export function ClickableLink({ url, position, children }:Props) {

  const onPointerDown = useCallback(() => {
    window.open(url, '_blank');
  }, [url]);

  return (
    <mesh
      position={position}
      onPointerDown={onPointerDown}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      {children}
    </mesh>
  );
}
