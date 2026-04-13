"use client";

import { useState } from "react";
import { FaceEnrollment } from "@/modules/attendance/face-enrollment";
import { deleteFaceData } from "@/lib/actions/attendance-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw, Trash2, ShieldX, Scan } from "lucide-react";
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

  if (showEnrollment) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
           <h2 className="text-xl font-black text-white uppercase italic tracking-widest">Biometric Enrollment Protocol</h2>
           <Button variant="ghost" className="text-slate-500 hover:text-white" onClick={() => setShowEnrollment(false)}>Cancel</Button>
        </div>
        <FaceEnrollment onComplete={() => {
          setShowEnrollment(false);
          router.refresh();
        }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-teal-500/10 bg-white/[0.02] backdrop-blur-md overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-black text-white uppercase italic tracking-tight">Biometric Actions</CardTitle>
          <CardDescription>Manage your face data used for automated attendance protocols.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {!initialFaceData ? (
            <Button 
              onClick={() => setShowEnrollment(true)} 
              className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-black rounded-xl gap-2"
            >
              <Scan className="h-4 w-4" />
              START ENROLLMENT
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => setShowEnrollment(true)} 
                variant="outline"
                className="border-white/10 hover:bg-white/5 font-bold rounded-xl gap-2"
              >
                <RefreshCcw className="h-4 w-4" />
                RE-REGISTER FACE
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 font-bold rounded-xl gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    DELETE BIOMETRIC DATA
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-slate-950 border-white/10">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white font-black uppercase italic">DANGER ZONE</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-400">
                      This action will permanently delete your facial embedding. You will no longer be able to use Face Attendance until you register again.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-rose-500 text-white hover:bg-rose-600 font-bold"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Confirm Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </CardContent>
      </Card>

      {!initialFaceData && (
        <div className="flex items-start gap-4 p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 text-amber-500/80 text-sm">
           <ShieldX className="h-10 w-10 shrink-0" />
           <div>
              <p className="font-black uppercase tracking-widest mb-1">Attention Required</p>
              <p className="font-medium">Sistem absensi otomatis memerlukan data biometrik yang valid. Segera lakukan registrasi untuk menghindari pencatatan manual oleh pengajar.</p>
           </div>
        </div>
      )}
    </div>
  );
}
