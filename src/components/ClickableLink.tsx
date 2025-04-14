import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useState, useCallback, ReactNode } from "react";

type Props = {
  url: string;
  position?: [number,number,number],
  children: ReactNode
}

export function ClickableLink({ url, position, children }:Props) {
  const mesh = useRef<any>(null!);
  const [hovered, setHovered] = useState(false);
  const { camera, gl } = useThree();

  // マウスオーバー時のスタイル変更
  useFrame(() => {
    if (mesh.current) {
      mesh.current.material.color.setRGB(
        hovered ? 1 : 0.5,
        hovered ? 0.5 : 0.5,
        hovered ? 0.5 : 1
      );
    }
  });

  // マウスイベントハンドラー
  // const onPointerOver = useCallback(() => setHovered(true), []);
  // const onPointerOut = useCallback(() => setHovered(false), []);
  const onPointerDown = useCallback(() => {
    window.open(url, '_blank');
    // もしくは window.location.href = url; で同じウィンドウで開く
  }, [url]);

  return (
    <mesh
      ref={mesh}
      position={position}
      onPointerDown={onPointerDown}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      {children}
    </mesh>
  );
}
