"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaceEnrollment } from "./face-enrollment";
import { FaceAttendance } from "./face-attendance";
import { AttendanceHistory } from "./attendance-history";

type AttendanceRecord = {
  id: string;
  status: "present" | "late" | "absent" | "excused";
  confidence_score: number;
  created_at: string;
};

type FaceData = {
  id: string;
  embedding: any;
  created_at: string;
};

export function AttendanceArena({ 
  faceData, 
  records 
}: { 
  faceData: FaceData | null; 
  records: AttendanceRecord[] 
}) {
  const router = useRouter();
  
  const hasAttendedToday = (records || []).some(r => 
    new Date(r.created_at).toDateString() === new Date().toDateString()
  );

  const handleComplete = () => {
    router.refresh();
  };

  if (!faceData) {
    return <FaceEnrollment onComplete={handleComplete} />;
  }

  if (!hasAttendedToday) {
    return (
      <FaceAttendance 
        masterEmbedding={faceData.embedding as number[]} 
        onComplete={handleComplete} 
      />
    );
  }

  return <AttendanceHistory records={records} />;
}
