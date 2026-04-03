import { getDataProvider } from "@/lib/data/provider";
import { calculateETAs } from "@/lib/estimator";
import { ActiveStudentsTable } from "@/components/active-students-table";
import { ArchivedStudentsList } from "@/components/archived-students-list";
import { QueueList } from "@/components/queue-list";
import { SettingsCard } from "@/components/settings-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const provider = getDataProvider();
  const [activeStudents, queuedStudents, archivedStudents, settings] = await Promise.all([
    provider.getActiveStudents(),
    provider.getQueuedStudents(),
    provider.getArchivedStudents(),
    provider.getSettings(),
  ]);

  const remainingLessons = activeStudents.map((s) => s.remaining_lessons);
  const etas = calculateETAs(
    remainingLessons,
    queuedStudents.length,
    settings.default_lessons
  );

  return (
    <div className="space-y-6">
      <SettingsCard defaultLessons={settings.default_lessons} />

      <ActiveStudentsTable
        students={activeStudents}
        defaultLessons={settings.default_lessons}
      />

      <QueueList students={queuedStudents} />

      <ArchivedStudentsList students={archivedStudents} />

      {/* ETA Preview */}
      {queuedStudents.length > 0 && activeStudents.length > 0 && (
        <Card className="border-2 border-warm-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">
              Queue ETA Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {queuedStudents.map((student, i) => (
              <div
                key={student.id}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-foreground">{student.name}</span>
                <Badge
                  variant="secondary"
                  className="rounded-full border-2 border-warm-border bg-cream text-warm-brown"
                >
                  ~{etas[i]} {etas[i] === 1 ? "week" : "weeks"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
