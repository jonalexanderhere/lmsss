"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "@vladmandic/face-api";
import { Camera, CheckCircle2, Loader2, Scan, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { saveFaceEmbedding } from "@/lib/actions/attendance-actions";
import { useFaceModels } from "./hooks/use-face-models";

export function FaceEnrollment({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isLoaded, error: modelError } = useFaceModels();
  
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState(0);
  const [embeddings, setEmbeddings] = useState<number[][]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Position your face");

  const startVideo = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setError("Izin kamera ditolak atau kamera tidak ditemukan.");
    }
  }, []);

  useEffect(() => {
    if (isLoaded) startVideo();
  }, [isLoaded, startVideo]);

  // Combined Status
  const displayError = modelError || error;

  useEffect(() => {
    let animationFrame: number;
    let lastCaptureTime = 0;

    const detectLoop = async () => {
      if (!videoRef.current || !isLoaded || count >= 5 || isCapturing) {
        animationFrame = requestAnimationFrame(detectLoop);
        return;
      }

      try {
        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          setStatus("Hold still...");
          const now = Date.now();
          
          // Auto capture every 1.5 seconds if face is detected
          if (now - lastCaptureTime > 1500) {
            const descriptor = Array.from(detection.descriptor);
            setEmbeddings((prev) => [...prev, descriptor]);
            setCount((prev) => prev + 1);
            setProgress((prev) => prev + 20);
            lastCaptureTime = now;
            setStatus(`Scan ${count + 1}/5 Complete!`);
          }
        } else {
          setStatus("Face not detected. Look at the camera.");
        }
      } catch (err) {
        console.error("Detection error:", err);
      }

      animationFrame = requestAnimationFrame(detectLoop);
    };

    if (isLoaded && videoRef.current) {
      detectLoop();
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [isLoaded, count, isCapturing]);

  const finalize = async () => {
    if (embeddings.length === 0) return;
    setIsCapturing(true);
    
    // Average the embeddings for a more robust master embedding
    const masterEmbedding = embeddings[0].map((_, i) => 
      embeddings.reduce((acc, curr) => acc + curr[i], 0) / embeddings.length
    );

    try {
      await saveFaceEmbedding(masterEmbedding);
      onComplete();
    } catch (err: any) {
      setError(err.message);
      setIsCapturing(false);
    }
  };

  return (
    <Card className="border-teal-500/20 bg-slate-950/80 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent animate-pulse" />
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-teal-400 italic font-black uppercase tracking-tighter text-2xl">
          <Scan className="h-6 w-6" />
          ENROLLMENT ARENA
        </CardTitle>
        <CardDescription className="text-slate-400">
          Sistem akan otomatis memindai wajah Anda sebanyak 5 kali. Pastikan pencahayaan cukup.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="relative aspect-video overflow-hidden rounded-[2rem] bg-black/40 border-2 border-white/5 shadow-2xl group">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="h-full w-full object-cover scale-x-[-1]"
          />
          
          {/* Scan Line Animation */}
          <div className="absolute inset-x-4 h-1 bg-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.5)] animate-scan-line z-20 pointer-events-none" />
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 transition-all z-30">
            {status}
          </div>

          {!videoRef.current?.srcObject && !isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 z-50">
              <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin text-teal-400 mx-auto mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Initializing AI Engines...</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span>Biometric Progress</span>
            <span className="text-teal-400">{count}/5 SCAN POINTS</span>
          </div>
          <Progress value={progress} className="h-3 bg-white/5 overflow-hidden" />
          <div className="grid grid-cols-5 gap-1 pt-1">
             {[...Array(5)].map((_, i) => (
               <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i < count ? 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.5)]' : 'bg-white/10'}`} />
             ))}
          </div>
        </div>

        {displayError && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm animate-in shake-1">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <p className="font-bold">{displayError}</p>
          </div>
        )}

        {count >= 5 && (
          <Button
            className="w-full h-14 bg-teal-500 hover:bg-teal-600 text-slate-950 text-lg font-black rounded-2xl transition-all active:scale-95 shadow-lg shadow-teal-500/20 gap-2"
            onClick={finalize}
            disabled={isCapturing}
          >
            {isCapturing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            {isCapturing ? "MEMPROSES..." : "AKTIFKAN PROFIL BIOMETRIK"}
          </Button>
        )}

        <div className="flex items-center justify-center gap-2 text-[8px] font-black text-slate-600 uppercase tracking-widest">
           <div className="h-px flex-1 bg-white/5" />
           <span>Security Level: Military Grade</span>
           <div className="h-px flex-1 bg-white/5" />
        </div>
      </CardContent>
    </Card>
  );
}
