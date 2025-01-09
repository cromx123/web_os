import React, { useState, useEffect, useRef } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import Webcam from 'react-webcam';

const FaceMeshTracker = ({ setHeadPosition }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);

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

    const videoElement = webcamRef.current?.video;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement?.getContext("2d");

    if (videoElement) {
      const camera = new Camera(videoElement, {
        onFrame: async () => {
          await faceMesh.send({ image: videoElement });
        },
        width: 640,
        height: 480,
      });

      faceMesh.onResults((results) => {
        if (canvasCtx && results.multiFaceLandmarks) {
          // Limpia el lienzo
          canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      
          if (results.multiFaceLandmarks.length > 0) {
            const landmarks = results.multiFaceLandmarks[0];
      
            // Lista de índices de los puntos clave
            const selectedLandmarksIndices = [1, 33, 263, 61, 291, 199]; // Nariz, ojos y boca
            const selectedLandmarks = selectedLandmarksIndices.map((index) => landmarks[index]);
      
            // Dibuja solo los puntos seleccionados
            selectedLandmarks.forEach((landmark) => {
              const x = landmark.x * canvasElement.width;
              const y = landmark.y * canvasElement.height;
      
              canvasCtx.beginPath();
              canvasCtx.arc(x, y, 3, 0, 2 * Math.PI); // Radio de 3px para los puntos seleccionados
              canvasCtx.fillStyle = "blue"; // Color de los puntos
              canvasCtx.fill();
            });
      
            // Calcula la posición de la cabeza utilizando la nariz y los ojos
            const nose = landmarks[1];
            const leftEye = landmarks[33];
            const rightEye = landmarks[263];
      
            const headPosition = {
              x: (leftEye.x + rightEye.x) / 2, // Promedio entre ojos para X
              y: (leftEye.y + rightEye.y) / 2, // Promedio entre ojos para Y
              z: nose.z, // Usa la profundidad de la nariz como referencia
            };
      
            // Actualiza la posición de la cabeza
            setHeadPosition(headPosition);
          }
        }
      });
      

      camera.start();
      setCameraReady(true);

      return () => {
        camera.stop();
      };
    }
  }, [setHeadPosition]);

  return (
    <div style={{ position: "relative", width: "640px", height: "480px" }}>
      {/* Cámara */}
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
        }}
      />

      {/* Lienzo para dibujar los puntos */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
        }}
        width="640"
        height="480"
      />

      {/* Indicador de carga */}
      {!cameraReady && <div>Loading camera...</div>}
    </div>
  );
};

export default FaceMeshTracker;
