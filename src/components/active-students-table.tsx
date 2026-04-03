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

  return (
    <Card className="border-2 border-warm-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">
          Active Students ({students.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {students.map((student) => (
          <StudentRow key={student.id} student={student} />
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

function StudentRow({ student }: { student: ActiveStudent }) {
  const [lessons, setLessons] = useState(student.remaining_lessons);
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
    if (lessons === student.remaining_lessons) return;
    setSaving(true);
    const formData = new FormData();
    formData.set("id", student.id);
    formData.set("remaining_lessons", String(lessons));
    await updateActiveStudent(formData);
    setSaving(false);
  };

  const handleArchive = async () => {
    const formData = new FormData();
    formData.set("id", student.id);
    await archiveActiveStudent(formData);
  };

  const handleRemove = async () => {
    const formData = new FormData();
    formData.set("id", student.id);
    await removeActiveStudent(formData);
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border-2 border-warm-border bg-peach-50 px-4 py-3">
      <span className="flex-1 font-semibold text-foreground">
        {student.name}
      </span>
      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground">Lessons left:</label>
        <Input
          type="number"
          min={0}
          value={lessons}
          onChange={(e) => setLessons(Number(e.target.value))}
          onBlur={handleUpdate}
          onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
          className="w-16 rounded-xl border-2 border-warm-border bg-white text-center text-sm"
          disabled={saving}
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleArchive}
        className="rounded-full border-2 border-warm-border text-pastel-blue hover:bg-pastel-blue/20"
      >
        Archive
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
