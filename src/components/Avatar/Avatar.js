import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Avatar(props) {
  const { nodes, materials } = useGLTF('/avatar.gltf')
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.Object_2.geometry} material={materials.material_0} />
        <mesh geometry={nodes.Object_3.geometry} material={materials.material_1} />
        <mesh geometry={nodes.Object_4.geometry} material={materials.material_2} />
        <mesh geometry={nodes.Object_5.geometry} material={materials.material_3} />
        <mesh geometry={nodes.Object_6.geometry} material={materials.material_4} />
        <mesh geometry={nodes.Object_7.geometry} material={materials.material_5} />
        <mesh geometry={nodes.Object_8.geometry} material={materials.material_6} />
        <mesh geometry={nodes.Object_9.geometry} material={materials.material_7} />
        <mesh geometry={nodes.Object_10.geometry} material={materials.material_8} />
      </group>
    </group>
  )
}

useGLTF.preload('/avatar.gltf')