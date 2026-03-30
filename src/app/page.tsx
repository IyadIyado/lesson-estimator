import { getDataProvider } from "@/lib/data/provider";
import { calculateETAs } from "@/lib/estimator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function PublicQueuePage() {
  const provider = getDataProvider();
  const [activeStudents, queuedStudents, settings] = await Promise.all([
    provider.getActiveStudents(),
    provider.getQueuedStudents(),
    provider.getSettings(),
  ]);

  const remainingLessons = activeStudents.map((s) => s.remaining_lessons);
  const etas = calculateETAs(
    remainingLessons,
    queuedStudents.length,
    settings.default_lessons
  );

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-foreground">
          Lesson Queue
        </h1>
        <p className="mt-2 text-muted-foreground">
          See when your lessons are estimated to begin
        </p>
      </div>

      {activeStudents.length === 0 ? (
        <Card className="border-2 border-warm-border bg-card">
          <CardContent className="py-8 text-center text-muted-foreground">
            No active students yet — check back soon!
          </CardContent>
        </Card>
      ) : queuedStudents.length === 0 ? (
        <Card className="border-2 border-warm-border bg-card">
          <CardContent className="py-8 text-center text-muted-foreground">
            The queue is empty — no one is waiting!
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-warm-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">
              Waiting List
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {queuedStudents.map((student, i) => (
              <div
                key={student.id}
                className="flex items-center justify-between rounded-2xl border-2 border-warm-border bg-peach-50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-peach-300 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-foreground">
                    {student.name}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ~{etas[i]} {etas[i] === 1 ? "week" : "weeks"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Estimates are based on current active students and may change.
      </p>
    </main>
  );
}
