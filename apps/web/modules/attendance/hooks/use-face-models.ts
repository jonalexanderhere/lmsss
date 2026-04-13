"use client";

import { useState, useEffect } from "react";
import * as faceapi from "@vladmandic/face-api";

let modelsLoadedPromise: Promise<void> | null = null;

export function useFaceModels() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadModels() {
      if (!modelsLoadedPromise) {
        const MODEL_URL = "/models";
        modelsLoadedPromise = Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]).then(() => {
          console.log("AI Models Loaded Successfully");
        });
      }

      try {
        await modelsLoadedPromise;
        setIsLoaded(true);
      } catch (err) {
        console.error("Failed to load AI models:", err);
        setError("Gagal memuat model AI.");
      }
    }

    loadModels();
  }, []);

  return { isLoaded, error };
}
