import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import FaceMeshTracker from './components/FaceMeshTracker';

const Model = ({ headPosition, scale }) => {
  const { scene, nodes } = useGLTF('result_avatar_esq.gltf');
  const headRef = useRef();

  useEffect(() => {
    if (headRef.current) {
      // La posición de la cabeza debe ajustarse en relación con la jerarquía del modelo
      // Calcula el ajuste necesario para que la cabeza esté alineada con el cuerpo
      headRef.current.position.set(
        headPosition.x,  // Mantén la posición X ajustada con el face tracking
        headPosition.y,  // Lo mismo para Y y Z
        headPosition.z
      );
    }
  }, [headPosition]);

  return (
    <primitive object={scene} scale={[scale, scale, scale]}>
      {/* Referencia directamente al nodo 'head' */}
      <primitive ref={headRef} object={nodes.head} />
    </primitive>
  );
};

const App = () => {
  const [headPosition, setHeadPosition] = useState({ x: 0, y: 0, z: 0 });
  const scale = 1;

  return (
    <div>
      <FaceMeshTracker setHeadPosition={setHeadPosition} />
      <Canvas>
        <ambientLight />
        {/* Modelo con la posición de la cabeza y la escala */}
        <Model headPosition={headPosition} scale={scale} />
      </Canvas>
    </div>
  );
};

export default App;
