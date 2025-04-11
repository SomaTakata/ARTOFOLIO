import Wall from "./Wall";

export default function Room() {
  return (
    <>
      {/* 床 */}
      <mesh rotation-x={-Math.PI * 0.5}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="lightseagreen" />
      </mesh>
      {/* 左壁 */}
      <Wall
        position={[0, 8, -25]}
        color="red"
        width={50}
        height={16}
        depth={0.1}
      />
      {/* 右壁 */}
      <Wall
        position={[0, 8, 25]}
        rotation={[0, -Math.PI, 0]}
        color="red"
        width={50}
        height={16}
        depth={0.1}
      />
      {/* 前壁 */}
      <Wall
        position={[-25, 8, 0]}
        rotation={[0, Math.PI * 0.5, 0]}
        color="blue"
        width={50}
        height={16}
        depth={0.1}
      />
      {/* 後壁 */}
      <Wall
        position={[25, 8, 0]}
        rotation={[0, -Math.PI * 0.5, 0]}
        color="blue"
        width={50}
        height={16}
        depth={0.1}
      />
      {/* 最初の壁 */}
      <Wall
        position={[5, 8, 15]}
        rotation={[0, -Math.PI, 0]}
        color="yellow"
        width={40}
        height={16}
        depth={0.1}
      />
      {/* スキルの壁 */}
      <Wall
        position={[-15, 8, 0]}
        rotation={[0, -Math.PI * 0.5, 0]}
        color="pink"
        width={30}
        height={16}
        depth={0.1}
      />
      {/* 作品 */}
      <Wall
        position={[5, 8, -10]}
        rotation={[0, -Math.PI * 0.5, 0]}
        color="orange"
        width={30}
        height={16}
        depth={0.1}
      />
      {/* 天井 */}
      <mesh position={[0, 16, 0]} rotation-x={Math.PI * 0.5}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="lightseagreen" />
      </mesh>
    </>
  );
}
