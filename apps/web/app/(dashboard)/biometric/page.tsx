import { Shell } from "@/components/layout/shell";
import { getFaceData, deleteFaceData } from "@/lib/actions/attendance-actions";
import { requireRole } from "@/lib/auth";
import { BiometricClient } from "./biometric-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, ShieldCheck, ShieldAlert, Fingerprint } from "lucide-react";

export default async function BiometricPage() {
  const auth = await requireRole(["admin", "teacher", "student"]);
  const faceData = await getFaceData();

  return (
    <Shell role={auth.user.role}>
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
             <BrainCircuit className="h-10 w-10 text-teal-400" />
             Face ID Hub
          </h1>
          <p className="text-slate-400 font-medium">Manage your biometric security profile and attendance credentials.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-white/10 bg-white/[0.02] backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Registration Status</CardTitle>
            </CardHeader>
            <CardContent>
              {faceData ? (
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-400">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white uppercase italic">Active Profile</p>
                    <p className="text-xs text-slate-500">Registered on {new Date(faceData.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400">
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white uppercase italic">Not Registered</p>
                    <p className="text-xs text-slate-500">Complete enrollment to use Face Attendance.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.02] backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Security Level</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-500">
                    <Fingerprint className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white uppercase italic">SHIELD AI PROTECTED</p>
                    <p className="text-xs text-slate-500">Encrypted Biometric Hash (AES-256)</p>
                  </div>
                </div>
            </CardContent>
          </Card>
        </div>

        <BiometricClient initialFaceData={faceData} />
      </div>
    </Shell>
  );
}
