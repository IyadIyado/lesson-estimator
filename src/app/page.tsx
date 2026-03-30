import { getDataProvider } from "@/lib/data/provider";
import { calculateETAs } from "@/lib/estimator";
import { Card, CardContent } from "@/components/ui/card";
import { QueueReveal } from "@/components/queue-reveal";

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
        <QueueReveal
          entries={queuedStudents.map((s, i) => ({
            id: s.id,
            name: s.name,
            eta: etas[i],
          }))}
        />
      )}

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Estimates are based on current active students and may change.
      </p>
    </main>
  );
}
