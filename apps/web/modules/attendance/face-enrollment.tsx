"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import { Camera, CheckCircle2, Loader2, Scan, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { saveFaceEmbedding } from "@/lib/actions/attendance-actions";

export function FaceEnrollment({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState(0);
  const [embeddings, setEmbeddings] = useState<number[][]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadModels() {
      try {
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
        setIsLoaded(true);
      } catch (err) {
        console.error("Failed to load models:", err);
        setError("Gagal memuat model AI. Pastikan file model tersedia di /public/models.");
      }
    }
    loadModels();
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Izin kamera ditolak atau kamera tidak ditemukan.");
    }
  };

  const captureFace = async () => {
    if (!videoRef.current || !isLoaded) return;
    setIsCapturing(true);

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        const descriptor = Array.from(detection.descriptor);
        setEmbeddings((prev) => [...prev, descriptor]);
        setCount((prev) => prev + 1);
        setProgress((prev) => prev + 20); // Capture 5 times for simplicity
      } else {
        setError("Wajah tidak terdeteksi. Pastikan pencahayaan cukup.");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat pemindaian.");
    } finally {
      setIsCapturing(false);
    }
  };

  const finalize = async () => {
    if (embeddings.length === 0) return;
    
    // Average the embeddings for a more robust master embedding
    const masterEmbedding = embeddings[0].map((_, i) => 
      embeddings.reduce((acc, curr) => acc + curr[i], 0) / embeddings.length
    );

    try {
      await saveFaceEmbedding(masterEmbedding);
      onComplete();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Card className="border-white/10 bg-slate-950/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-teal-400 italic font-black uppercase tracking-tighter">
          <Scan className="h-5 w-5" />
          ENROLLMENT ARENA
        </CardTitle>
        <CardDescription>
          Pindai wajah Anda dari 5 sudut berbeda untuk mengaktifkan sistem Absensi Biometrik.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-black/40 border border-white/5 shadow-inner">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="h-full w-full object-cover scale-x-[-1]"
            onPlay={startVideo}
          />
          {!videoRef.current?.srcObject && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button onClick={startVideo} variant="secondary" className="gap-2 bg-teal-500 text-slate-950 hover:bg-teal-600 rounded-xl">
                <Camera className="h-4 w-4" />
                AKTIFKAN KAMERA
              </Button>
            </div>
          )}
          {isCapturing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <Loader2 className="h-10 w-10 animate-spin text-teal-400" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span>Progress Pengenalan</span>
            <span>{count}/5 Angle</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/5" />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex gap-4">
          {count < 5 ? (
            <Button
              className="flex-1 bg-white text-slate-950 hover:bg-slate-200 font-bold rounded-xl"
              onClick={captureFace}
              disabled={!isLoaded || isCapturing}
            >
              PINDAI SUDUT {count + 1}
            </Button>
          ) : (
            <Button
              className="flex-1 bg-teal-500 text-slate-950 hover:bg-teal-600 font-bold rounded-xl gap-2"
              onClick={finalize}
            >
              <CheckCircle2 className="h-4 w-4" />
              SIMPAN PROFIL BIOMETRIK
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
