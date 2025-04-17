import React, { useRef } from 'react'
import * as THREE from 'three'

type Props = {
  /** ベンチ全体の配置座標 */
  position?: [number, number, number]
}

export default function MuseumBench({
  position = [0, 0, 0],
}: Props) {
  // Seat と legs に ref を付けたい場合の型付け
  const seatRef = useRef<THREE.Mesh | null>(null)
  const legRefs = useRef<(THREE.Mesh | null)[]>([])

  // dimensions
  const seatWidth = 8
  const seatDepth = 20
  const seatThickness = 0.5
  const legHeight = 5
  const legThickness = 1.0

  // leg offsets の計算
  const halfW = seatWidth / 2 - legThickness / 2
  const halfD = seatDepth / 2 - legThickness / 2

  // ←ここで厳密にタプル型を指定
  const legOffsets: [number, number, number][] = [
    [-halfW, -(legHeight + seatThickness) / 2, -halfD],
    [ halfW, -(legHeight + seatThickness) / 2, -halfD],
    [-halfW, -(legHeight + seatThickness) / 2,  halfD],
    [ halfW, -(legHeight + seatThickness) / 2,  halfD],
  ]

  return (
    <group position={position}>
      {/* Seat plank */}
      <mesh ref={seatRef} castShadow receiveShadow>
        <boxGeometry args={[seatWidth, seatThickness, seatDepth]} />
        <meshStandardMaterial
          color="white"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Legs */}
      {legOffsets.map((offset, idx) => (
        <mesh
          key={idx}
          // useRef の current が Mesh|null[] なので代入OK
          ref={el => (legRefs.current[idx] = el)}
          position={offset}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[legThickness, legHeight, legThickness]} />
          <meshStandardMaterial
            color="white"
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}
