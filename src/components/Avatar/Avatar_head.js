import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Avatar(props) {
  const { nodes, materials } = useGLTF('/head.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.eye_low_L.geometry} material={materials['Material.001']} position={[-3.313, 24.513, 11.796]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
      <mesh geometry={nodes.eye_low_L001.geometry} material={materials['Material.001']} position={[3.313, 24.513, 11.796]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
      <mesh geometry={nodes.man_body_0014_uv_map.geometry} material={materials['Material.003']} position={[0, 20.783, 9.867]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
    </group>
  )
}

useGLTF.preload('/head.gltf')