"use client";

import { useRef, useState } from "react";
import type { ActiveStudent } from "@/lib/data/types";
import {
  addActiveStudent,
  archiveActiveStudent,
  removeActiveStudent,
  updateActiveStudent,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ActiveStudentsTable({
  students,
  defaultLessons,
}: {
  students: ActiveStudent[];
  defaultLessons: number;
}) {
  const addFormRef = useRef<HTMLFormElement>(null);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const hasChanges = Object.entries(edits).some(([id, val]) => {
    const student = students.find((s) => s.id === id);
    if (!student) return false;
    const num = parseInt(val, 10);
    return !isNaN(num) && num !== student.remaining_lessons;
  });

  const setLessons = (id: string, value: string) => {
    setEdits((prev) => ({ ...prev, [id]: value }));
  };

  const getLessons = (student: ActiveStudent): string => {
    if (student.id in edits) return edits[student.id];
    return String(student.remaining_lessons);
  };

  const increment = (student: ActiveStudent) => {
    const current = parseInt(getLessons(student), 10);
    const val = isNaN(current) ? student.remaining_lessons : current;
    setLessons(student.id, String(val + 1));
  };

  const decrement = (student: ActiveStudent) => {
    const current = parseInt(getLessons(student), 10);
    const val = isNaN(current) ? student.remaining_lessons : current;
    if (val > 0) setLessons(student.id, String(val - 1));
  };

  const handleSave = async () => {
    setSaving(true);
    const updates = Object.entries(edits)
      .map(([id, val]) => {
        const student = students.find((s) => s.id === id);
        const num = parseInt(val, 10);
        if (!student || isNaN(num) || num === student.remaining_lessons) return null;
        return { id, remaining_lessons: num };
      })
      .filter((u): u is { id: string; remaining_lessons: number } => u !== null);

    for (const update of updates) {
      const formData = new FormData();
      formData.set("id", update.id);
      formData.set("remaining_lessons", String(update.remaining_lessons));
      await updateActiveStudent(formData);
    }
    setEdits({});
    setSaving(false);
  };

  return (
    <Card className="border-2 border-warm-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-foreground">
          Active Students ({students.length})
        </CardTitle>
        {hasChanges && (
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-pastel-green text-foreground hover:bg-pastel-green/80"
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {students.map((student) => (
          <div
            key={student.id}
            className="flex items-center gap-3 rounded-2xl border-2 border-warm-border bg-peach-50 px-4 py-3"
          >
            <span className="flex-1 font-semibold text-foreground">
              {student.name}
            </span>
            <div className="flex items-center gap-1">
              <label className="mr-1 text-xs text-muted-foreground">Lessons left:</label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => decrement(student)}
                className="h-8 w-8 rounded-full border-2 border-warm-border p-0 text-foreground hover:bg-peach-100"
              >
                −
              </Button>
              <Input
                type="number"
                min={0}
                value={getLessons(student)}
                onChange={(e) => setLessons(student.id, e.target.value)}
                className="w-16 rounded-xl border-2 border-warm-border bg-white text-center text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => increment(student)}
                className="h-8 w-8 rounded-full border-2 border-warm-border p-0 text-foreground hover:bg-peach-100"
              >
                +
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const formData = new FormData();
                formData.set("id", student.id);
                await archiveActiveStudent(formData);
              }}
              className="rounded-full border-2 border-warm-border text-teal-600 hover:bg-pastel-blue/20"
            >
              Archive
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const formData = new FormData();
                formData.set("id", student.id);
                await removeActiveStudent(formData);
              }}
              className="rounded-full border-2 border-warm-border text-peach-600 hover:bg-peach-100"
            >
              Remove
            </Button>
          </div>
        ))}

        {/* Add new student */}
        <form
          ref={addFormRef}
          action={async (formData) => {
            await addActiveStudent(formData);
            addFormRef.current?.reset();
          }}
          className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-warm-border bg-peach-50 px-4 py-3"
        >
          <Input
            name="name"
            placeholder="Student name"
            required
            className="flex-1 rounded-xl border-2 border-warm-border bg-white"
          />
          <Input
            name="remaining_lessons"
            type="number"
            min={0}
            defaultValue={defaultLessons}
            className="w-20 rounded-xl border-2 border-warm-border bg-white text-center"
          />
          <Button
            type="submit"
            size="sm"
            className="rounded-full bg-pastel-green text-foreground hover:bg-pastel-green/80"
          >
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
