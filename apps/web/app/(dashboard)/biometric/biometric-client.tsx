"use client";
import { useState } from "react";
import Image from "next/image";

import { FaceEnrollment } from "@/modules/attendance/face-enrollment";
import { deleteFaceData } from "@/lib/actions/attendance-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw, Trash2, ShieldX, Scan, Loader2, ShieldCheck, Fingerprint } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function BiometricClient({ initialFaceData }: { initialFaceData: any }) {
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteFaceData();
      router.refresh();
      setShowEnrollment(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 relative">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <div className="space-y-2">
           <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
             <Scan className="h-10 w-10 text-teal-500" />
             Biometric Hub
           </h1>
           <p className="text-slate-400 font-medium">Manage your digital identity and security protocols.</p>
        </div>
        
        <div className="flex items-center gap-4">
           {!initialFaceData && (
             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 animate-pulse">
                <ShieldX className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Action Required</span>
             </div>
           )}
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-2 relative z-10">
        {/* Registration Status Card */}
        <Card className="border-white/10 bg-slate-950/50 backdrop-blur-xl relative overflow-hidden group border-2">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
          
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl ${initialFaceData ? 'bg-teal-500/10 text-teal-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {initialFaceData ? <ShieldCheck className="h-6 w-6" /> : <ShieldX className="h-6 w-6" />}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${initialFaceData ? 'bg-teal-500 animate-pulse' : 'bg-slate-700'}`} />
                {initialFaceData ? "Active Terminal" : "Offline Mode"}
              </div>
            </div>
            <CardTitle className="text-2xl font-black text-white italic mt-4 uppercase">Biometric Identity</CardTitle>
            <CardDescription className="text-slate-400">
              {initialFaceData 
                ? "Profil wajah Anda terdaftar dan dienkripsi dalam database AI Secure."
                : "Anda belum mendaftarkan data biometrik untuk sistem absensi otomatis."}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 space-y-6">
            <AlertDialog open={showEnrollment} onOpenChange={setShowEnrollment}>
              <AlertDialogTrigger asChild>
                {!initialFaceData ? (
                  <Button 
                    className="w-full h-16 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-2xl gap-3 shadow-lg shadow-teal-500/20 transition-all active:scale-95"
                  >
                    <Scan className="h-5 w-5" />
                    INITIATE SCANNING PROTOCOL
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    className="w-full h-14 border-white/10 hover:bg-white/5 font-bold rounded-xl gap-2 text-white"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    RE-CALIBRATE BIOMETRICS
                  </Button>
                )}
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-2xl bg-slate-950/95 border-white/10 p-0 overflow-hidden rounded-[2.5rem] border-2 shadow-2xl backdrop-blur-3xl">
                <FaceEnrollment onComplete={() => {
                  setShowEnrollment(false);
                  router.refresh();
                }} />
              </AlertDialogContent>
            </AlertDialog>

            {initialFaceData && (
              <div className="pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 mb-4 text-rose-500">
                  <Trash2 className="h-4 w-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Danger Zone</span>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="danger" className="w-full h-14 font-black rounded-xl gap-2">
                      PURGE ALL BIOMETRIC DATA
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-950 border-white/10 rounded-3xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl font-black text-white italic">ABORT PROTOCOL?</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-400">
                        Tindakan ini akan menghapus permanen master embedding wajah Anda dari database. Anda harus mendaftar ulang untuk menggunakan absensi AI.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6 gap-4">
                      <AlertDialogCancel className="h-12 border-white/10 rounded-xl text-white">CANCEL</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="h-12 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-xl"
                      >
                        {isDeleting ? "PURGING..." : "PURGE NOW"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info/Privacy Card */}
        <Card className="border-white/10 bg-slate-900/40 backdrop-blur-xl relative overflow-hidden group border-2">
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-teal-500/5 to-transparent pointer-events-none" />
          <CardHeader>
            <div className="p-3 w-fit rounded-2xl bg-amber-500/10 text-amber-500">
              <Fingerprint className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl font-black text-white italic mt-4 uppercase">Data Protection Notice</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-400 leading-relaxed space-y-4 relative z-10">
            <p>
              Kami tidak menyimpan foto wajah Anda. Hanya representasi matematika (embedding) dalam bentuk vektor angka yang disimpan dan dienkripsi.
            </p>
            <p>
              Data ini digunakan secara eksklusif untuk otentikasi absensi harian di dalam platform NetClassix guna mencegah kecurangan (proxy attendance).
            </p>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
               <div className="flex items-center gap-3 text-teal-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encryption Active</span>
               </div>
               <div className="flex items-center gap-3 text-teal-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">GDPR Biometric Compliant</span>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


