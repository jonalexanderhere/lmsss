import { QuizClient } from "@/modules/quiz/quiz-client";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function QuizPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Session: {id}</CardTitle>
          <CardDescription>
            Question set bisa diacak per user, tersimpan score, duration, dan mistake analysis.
          </CardDescription>
        </CardHeader>
      </Card>
      <QuizClient />
    </div>
  );
}
