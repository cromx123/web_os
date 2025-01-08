import { useEffect, useRef, useState } from "react";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import "@tensorflow/tfjs";

export const useFaceTracking = () => {
  const [headPosition, setHeadPosition] = useState([0, 0, 0]);
  const videoRef = useRef(null);

  useEffect(() => {
    const loadModelAndStartTracking = async () => {
      const model = await faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: "mediapipe",
          solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
        }
      );
  
      // Inicia el video
      const video = videoRef.current;
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            video.srcObject = stream;
            video.play();
          });
      }
  
      // Realiza el seguimiento
      const detect = async () => {
        if (video.readyState === 4) {
          const faces = await model.estimateFaces(video, false);
          if (faces.length > 0) {
            const nose = faces[0].keypoints.find((kp) => kp.name === "nose");
            if (nose) {
              const newHeadPosition = [nose.x, nose.y, nose.z];
              console.log("Head Position: ", newHeadPosition); // Verifica los valores de la posición de la cabeza
              setHeadPosition(newHeadPosition);
            }
          }
        }
        requestAnimationFrame(detect);
      };
  
      detect();
    };
  
    loadModelAndStartTracking();
  }, []);

  return { headPosition, videoRef };
};
