import { AITutorPanel } from "@/components/features/ai-tutor-panel";
import { Hero } from "@/components/features/hero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseList } from "@/modules/courses/course-list";
import { Sparkles } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";

export default function HomePage() {
  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-8 px-4 py-4 lg:px-6">
      <Hero />
      <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <FadeIn direction="up">
            <Card className="border-white/10 bg-slate-900/40 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-transparent" />
              <CardHeader className="relative">
                <CardTitle className="text-2xl">Mengenal NetClassix</CardTitle>
                <CardDescription>
                  Platform Learning Management System yang dirancang khusus untuk siswa TJKT SMK Negeri 1 Liwa.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative prose prose-invert max-w-none text-slate-400">
                <p>
                  NetClassix hadir sebagai solusi modern untuk menjembatani teori dan praktik di dunia networking dan IT. 
                  Dengan fokus pada kurikulum TJKT (Teknik Jaringan Komputer dan Telekomunikasi), platform ini menyediakan:
                </p>
                <ul className="grid sm:grid-cols-2 gap-4 mt-4 list-none pl-0">
                  <li className="flex items-start gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <div className="h-2 w-2 rounded-full bg-teal-400 mt-2 shrink-0" />
                    <span><strong>UKK Readiness:</strong> Materi dan kuis yang diselaraskan dengan standar Uji Kompetensi Keahlian.</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <div className="h-2 w-2 rounded-full bg-cyan-400 mt-2 shrink-0" />
                    <span><strong>AI Tutor Support:</strong> Chatbot pintar yang siap membantu menjawab pertanyaan teknis 24/7.</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <div className="h-2 w-2 rounded-full bg-blue-400 mt-2 shrink-0" />
                    <span><strong>Lab Simulation:</strong> Pengalaman belajar interaktif dengan video dan materi instruksional mendalam.</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <div className="h-2 w-2 rounded-full bg-purple-400 mt-2 shrink-0" />
                    <span><strong>Gamified Progress:</strong> Kumpulkan XP dan naikkan rank Anda seiring dengan kemajuan belajar.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <Card className="border-white/10 bg-slate-900/40">
              <CardHeader>
                <CardTitle>Program Tracks</CardTitle>
                <CardDescription>
                  Pilih jalur pembelajaran sesuai minat dan tingkat keahlian Anda.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CourseList />
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        <div className="space-y-8">
          <FadeIn direction="left" delay={0.3}>
            <AITutorPanel />
          </FadeIn>
          
          <FadeIn direction="left" delay={0.4}>
            <Card className="border-white/10 bg-gradient-to-br from-amber-400/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  Tips Hari Ini
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-400 italic">
                "Kuasai dasar-dasar OSI Layer sebelum melompat ke konfigurasi router yang kompleks. Fondasi yang kuat adalah kunci engineer yang hebat."
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
