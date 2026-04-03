"use client";

import type { ArchivedStudent } from "@/lib/data/types";
import { restoreArchivedStudent, removeArchivedStudent } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ArchivedStudentsList({ students }: { students: ArchivedStudent[] }) {
  if (students.length === 0) {
    return (
      <Card className="border-2 border-warm-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Archived Students (0)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No archived students. Use &ldquo;Archive&rdquo; on an active student to pause them without affecting queue estimates.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-warm-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">
          Archived Students ({students.length})
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          These students are on a break and do not affect queue estimates.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {students.map((student) => (
          <ArchivedRow key={student.id} student={student} />
        ))}
      </CardContent>
    </Card>
  );
}

function ArchivedRow({ student }: { student: ArchivedStudent }) {
  const handleRestore = async () => {
    const formData = new FormData();
    formData.set("id", student.id);
    await restoreArchivedStudent(formData);
  };

  const handleRemove = async () => {
    const formData = new FormData();
    formData.set("id", student.id);
    await removeArchivedStudent(formData);
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-warm-border bg-peach-50/60 px-4 py-3">
      <span className="flex-1 font-semibold text-foreground">{student.name}</span>
      <span className="text-xs text-muted-foreground">
        {student.remaining_lessons} lesson{student.remaining_lessons !== 1 ? "s" : ""} left
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRestore}
        className="rounded-full border-2 border-warm-border text-pastel-green hover:bg-pastel-green/20"
      >
        Restore
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRemove}
        className="rounded-full border-2 border-warm-border text-peach-600 hover:bg-peach-100"
      >
        Remove
      </Button>
    </div>
  );
}
