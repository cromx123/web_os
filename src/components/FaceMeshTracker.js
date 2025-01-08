import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

const FaceMeshTracker = ({ setHeadPosition }) => {
  const webcamRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false); // Estado para verificar si la cámara está lista

  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];

        const nose = landmarks[1];
        const leftEye = landmarks[33];
        const rightEye = landmarks[263];

        const headPosition = {
          x: (leftEye.x + rightEye.x) / 2,
          y: (leftEye.y + rightEye.y) / 2,
          z: nose.z,
        };

        setHeadPosition(headPosition); // Actualiza la posición de la cabeza
      }
    });

    let camera = null;
    const videoElement = webcamRef.current?.video;

    if (videoElement) {
      // Iniciar la cámara solo cuando el video está listo
      const checkVideoReady = setInterval(() => {
        if (videoElement.readyState === 4) {
          clearInterval(checkVideoReady);
          const camera = new Camera(videoElement, {
            onFrame: async () => {
              await faceMesh.send({ image: videoElement });
            },
            width: 640,
            height: 480,
          });
          camera.start();
          setCameraReady(true);
        }
      }, 100);
    }

    return () => {
      if (camera) camera.stop();
    };
  }, [setHeadPosition]);

  return (
    <div style={{ position: 'relative', width: '640px', height: '480px' }}>
      <Webcam
        ref={webcamRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
        }}
      />
      {!cameraReady && <div>Loading camera...</div>}
    </div>
  );
};

export default FaceMeshTracker;
