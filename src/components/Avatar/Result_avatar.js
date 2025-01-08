import React, { useEffect, useRef } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

export default function Avatar({ headPosition, ...props }) {
  const group = useRef();
  const { scene, animations } = useGLTF('/result_avatar_esq.gltf');
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions } = useAnimations(animations, group);

  // Ref para la cabeza y la posición
  const headRef = useRef();

  useEffect(() => {
    if (headRef.current) {
      // Actualiza la posición de la cabeza cuando headPosition cambie
      headRef.current.position.set(headPosition[0], headPosition[1], headPosition[2]);
    }
  }, [headPosition]); // Esto se ejecuta cada vez que headPosition cambia

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="hueso_principal" position={[0, 0.772, 0]} scale={0.088}>
          <primitive object={nodes.Bone} />
          <primitive object={nodes.neutral_bone} />
          <skinnedMesh name="model" geometry={nodes.model.geometry} material={materials['CustomMaterial.001']} skeleton={nodes.model.skeleton} />
          <group name="Head" ref={headRef}>
            <primitive object={nodes.head} />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/result_avatar_esq.gltf');
