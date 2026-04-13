"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import { Camera, CheckCircle2, Loader2, Scan, ShieldAlert, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { logAttendance } from "@/lib/actions/attendance-actions";

export function FaceAttendance({ masterEmbedding, onComplete }: { masterEmbedding: number[], onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

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
        setError("Gagal memuat model AI.");
      }
    }
    loadModels();
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setError("Izin kamera ditolak.");
    }
  };

  const verifyFace = async () => {
    if (!videoRef.current || !isLoaded) return;
    setIsVerifying(true);
    setError(null);

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        const currentDescriptor = detection.descriptor;
        const distance = faceapi.euclideanDistance(currentDescriptor, new Float32Array(masterEmbedding));
        
        // Threshold: distance < 0.6 is typically a match
        const matchConfidence = 1 - distance;
        setConfidence(matchConfidence);

        if (matchConfidence >= 0.6) {
          await logAttendance(matchConfidence, "present");
          setIsSuccess(true);
          setTimeout(onComplete, 2000);
        } else {
          setError("Wajah tidak cocok. Silakan coba lagi.");
        }
      } else {
        setError("Wajah tidak terdeteksi.");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat verifikasi.");
    } finally {
      setIsVerifying(false);
    }
  };

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
            onPlay={startVideo}
          />
          
          {/* Scanning Overlay */}
          <div className="absolute inset-x-8 top-1/4 h-0.5 bg-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.5)] animate-scan-line z-20" />
          
          {!videoRef.current?.srcObject && (
            <div className="absolute inset-0 flex items-center justify-center z-30">
              <Button onClick={startVideo} variant="secondary" className="gap-2 bg-teal-500 text-slate-950 hover:bg-teal-600 rounded-xl font-bold">
                <Camera className="h-4 w-4" />
                MULAI SCAN
              </Button>
            </div>
          )}

          {isVerifying && (
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

        {error && (
          <div className="flex items-center gap-2 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm animate-in shake-1">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <Button
          className="w-full h-14 bg-teal-500 hover:bg-teal-600 text-slate-950 text-lg font-black rounded-2xl transition-all active:scale-95"
          onClick={verifyFace}
          disabled={!isLoaded || isVerifying || isSuccess}
        >
          {isVerifying ? "MENCARI COCOK..." : "LAKUKAN PRESENSI"}
        </Button>

        <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest italic">
          BETA BIOMETRIC V1.0 • SHIELD AI PROTECTED
        </p>
      </CardContent>
    </Card>
  );
}
