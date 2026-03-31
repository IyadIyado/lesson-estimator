import Image from "next/image";
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
    <main className="mx-auto max-w-lg px-4 py-12 md:max-w-5xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-foreground">Lesson Queue</h1>
        <p className="mt-2 text-muted-foreground">
          See when your lessons are estimated to begin
        </p>
      </div>

      {/* Two-column layout on desktop */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start">

        {/* Left column: Queue */}
        <div className="md:w-80 md:shrink-0">
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
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Estimates are based on current active students and may change.
          </p>
        </div>

        {/* Right column: Blurb */}
        <div>
        <div className="flex-1 space-y-4 rounded-3xl border-2 border-warm-border bg-card p-8">
          <h2 className="text-xl font-extrabold text-foreground">
            A Dedication to Safe and Stress-Free Driving
          </h2>
          <p className="text-sm leading-relaxed text-foreground/80">
            My primary mission as an instructor is to instill a deep-seated commitment to{" "}
            <strong>safety </strong> in every student who sits behind the wheel. I believe
            that being a truly great driver goes far beyond technical skill; it is about
            developing a proactive mindset and the situational awareness necessary to
            navigate the road responsibly. By emphasizing defensive driving techniques and a
            thorough understanding of the rules of the road, I aim to ensure that my
            students aren&apos;t just ready to pass their road test, but are fully prepared
            to protect themselves and others for a lifetime of driving.
          </p>
          <p className="text-sm leading-relaxed text-foreground/80">
            I understand that learning to drive can be an incredibly nerve-wracking
            experience, which is why I strive to cultivate a{" "}
            <strong>comforting and patient learning environment</strong>. My goal is to
            transform the car into a space where students feel heard, supported, and free to
            learn at their own pace without judgment. By maintaining a calm and encouraging
            presence, I help lower the &quot;stress floor,&quot; allowing my students to
            focus entirely on the mechanics of driving and the nuances of the road without
            being hindered by anxiety.
          </p>
          <p className="text-sm leading-relaxed text-foreground/80">
            Ultimately, I believe that the best learning happens when a student feels both
            physically safe and emotionally secure. When the pressure of the environment is
            replaced with clear communication and a steady hand, confidence naturally takes
            its place. I am dedicated to guiding each individual through their unique
            learning curve, providing the support they need to become the{" "}
            <strong>focused, stress-free, and conscientious drivers</strong> that our
            community deserves.
          </p>
        </div>
          <p className="pt-2 text-base font-semibold italic text-muted-foreground">
            &quot;btw the above is written with AI, but it pretty much covers the gist of
            my teaching philosophy&quot; — Iyad A.
          </p>

      </div>
      </div>


      {/* Spotify card */}
      <a
        href="https://open.spotify.com/playlist/1wfBacPNqUzgN1k5ZdbVde?si=957f1ae2a08d4fd0"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex items-center gap-4 rounded-3xl border-2 border-warm-border bg-card px-6 py-4 transition-shadow hover:shadow-md"
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8 shrink-0 fill-[#1DB954]" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
        <span className="font-semibold text-foreground">Link to my music playlist</span>
      </a>

      {/* Sushi card */}
      <div className="mt-6 overflow-hidden rounded-3xl border-2 border-warm-border bg-card">
        <div className="relative h-96 w-full md:h-256">
          <Image
            src="/Sushi.jpg"
            alt="Sushi"
            fill
            className="object-cover"
          />
        </div>
        <p className="px-6 py-4 text-center text-lg font-extrabold text-foreground">
          Sushi
        </p>
      </div>

    </main>
  );
}
