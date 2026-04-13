"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "@vladmandic/face-api";
import { Camera, CheckCircle2, Loader2, Scan, ShieldAlert, Fingerprint, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { logAttendance } from "@/lib/actions/attendance-actions";
import { useFaceModels } from "./hooks/use-face-models";

export function FaceAttendance({ masterEmbedding, onComplete }: { masterEmbedding: number[], onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isLoaded, error: modelError } = useFaceModels();
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [status, setStatus] = useState("Initializing Scanner...");
  const [matchCounter, setMatchCounter] = useState(0);

  const startVideo = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setStatus("Scanning for Match...");
    } catch (err) {
      setError("Izin kamera ditolak.");
    }
  }, []);

  useEffect(() => {
    if (isLoaded) startVideo();
  }, [isLoaded, startVideo]);

  useEffect(() => {
    let animationFrame: number;
    const REQUIRED_STABILITY = 3; // Number of consecutive frames with high confidence

    const detectLoop = async () => {
      if (!videoRef.current || !isLoaded || isSuccess || isVerifying) {
        animationFrame = requestAnimationFrame(detectLoop);
        return;
      }

      try {
        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          const distance = faceapi.euclideanDistance(detection.descriptor, new Float32Array(masterEmbedding));
          const matchConfidence = Math.max(0, 1 - distance);
          setConfidence(matchConfidence);

          if (matchConfidence >= 0.6) {
            setMatchCounter(prev => prev + 1);
            setStatus(`Matching... ${Math.round(matchConfidence * 100)}%`);
            
            if (matchCounter >= REQUIRED_STABILITY) {
              await handleSuccess(matchConfidence);
            }
          } else {
            setMatchCounter(0);
            setStatus("Face mismatch. Try adjusting position.");
          }
        } else {
          setMatchCounter(0);
          setConfidence(null);
          setStatus("Seeking Face...");
        }
      } catch (err) {
        console.error("Attendance Detection error:", err);
      }

      animationFrame = requestAnimationFrame(detectLoop);
    };

    const handleSuccess = async (finalConfidence: number) => {
      setIsVerifying(true);
      try {
        await logAttendance(finalConfidence, "present");
        setIsSuccess(true);
        setTimeout(onComplete, 2000);
      } catch (err) {
        setError("Gagal mencatat absensi.");
        setIsVerifying(false);
        setMatchCounter(0);
      }
    };

    if (isLoaded && videoRef.current) {
      detectLoop();
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [isLoaded, isSuccess, isVerifying, masterEmbedding, matchCounter, onComplete]);

  return (
    <Card className="border-teal-500/20 bg-slate-950/80 backdrop-blur-2xl shadow-2xl shadow-teal-500/5 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
      
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/20">
          <Fingerprint className="h-8 w-8" />
        </div>
        <CardTitle className="text-2xl font-black text-white italic tracking-tight">BIOMETRIC AUTH</CardTitle>
        <CardDescription>
          Pindai wajah Anda untuk memverifikasi kehadiran hari ini.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="relative aspect-square max-w-[300px] mx-auto overflow-hidden rounded-[40px] bg-black/40 border-2 border-white/5 group">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="h-full w-full object-cover scale-x-[-1]"
          />
          
          {/* Scanning Overlay */}
          <div className="absolute inset-x-8 h-1 bg-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.5)] animate-scan-line z-20 pointer-events-none" />
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-slate-950/90 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 z-30 flex items-center gap-2">
            <Search className="h-3 w-3 animate-pulse" />
            {status}
          </div>

          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 z-40">
              <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin text-teal-400 mx-auto mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Syncing AI Core...</p>
              </div>
            </div>
          )}

          {isVerifying && !isSuccess && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-md z-40 animate-pulse">
              <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin text-teal-400 mx-auto mb-2" />
                <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Memproses Wajah...</p>
              </div>
            </div>
          )}

          {isSuccess && (
            <div className="absolute inset-0 flex items-center justify-center bg-teal-500/90 backdrop-blur-sm z-50 animate-in fade-in zoom-in duration-300">
               <div className="text-center text-slate-950">
                  <CheckCircle2 className="h-16 w-16 mx-auto mb-2" />
                  <p className="text-xl font-black uppercase italic">VALIDATED</p>
                  <p className="text-xs font-bold opacity-80">Absensi Berhasil!</p>
               </div>
            </div>
          )}
        </div>

        {confidence !== null && !isSuccess && (
          <div className="space-y-2 px-4">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-slate-500">Match Confidence</span>
              <span className={confidence >= 0.6 ? "text-teal-400" : "text-rose-400"}>
                {Math.round(confidence * 100)}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${confidence >= 0.6 ? 'bg-teal-500' : 'bg-rose-500'}`}
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
          </div>
        )}

        {(error || modelError) && (
          <div className="flex items-center gap-2 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm animate-in shake-1">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <p className="font-medium">{error || modelError}</p>
          </div>
        )}

        {!videoRef.current?.srcObject && isLoaded && (
          <Button
            className="w-full h-14 bg-teal-500 hover:bg-teal-600 text-slate-950 text-lg font-black rounded-2xl transition-all active:scale-95"
            onClick={startVideo}
          >
            AKTIFKAN KAMERA
          </Button>
        )}

        <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest italic">
          BETA BIOMETRIC V1.5 • SHIELD AI PROTECTED
        </p>
      </CardContent>
    </Card>
  );
}
