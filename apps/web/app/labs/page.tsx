import { LabSimulator } from "@/modules/labs/lab-simulator";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LabsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Practice Lab</CardTitle>
          <CardDescription>
            Simulasi CLI untuk IP addressing, subnetting, routing, dan skenario troubleshooting ringan.
          </CardDescription>
        </CardHeader>
      </Card>
      <LabSimulator />
    </div>
  );
}
