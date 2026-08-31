"use client";

import { useRef, useState } from "react";
import type { PrivateStudent } from "@/lib/data/types";
import {
  addPrivateStudent,
  removePrivateStudent,
  updatePrivateStudent,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Edits = Record<string, { rate?: string; hours?: string; misc?: string }>;

export function PrivateStudentsTable({
  students,
}: {
  students: PrivateStudent[];
}) {
  const addFormRef = useRef<HTMLFormElement>(null);
  const [edits, setEdits] = useState<Edits>({});
  const [saving, setSaving] = useState(false);

  const hasChanges = Object.entries(edits).some(([id, edit]) => {
    const student = students.find((s) => s.id === id);
    if (!student) return false;
    for (const field of ["rate", "hours", "misc"] as const) {
      if (edit[field] !== undefined) {
        const num = parseInt(edit[field], 10);
        if (!isNaN(num) && num !== student[field]) return true;
      }
    }
    return false;
  });

  const setField = (id: string, field: "rate" | "hours" | "misc", value: string) => {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const getRate = (student: PrivateStudent): string => {
    return edits[student.id]?.rate ?? String(student.rate);
  };

  const getHours = (student: PrivateStudent): string => {
    return edits[student.id]?.hours ?? String(student.hours);
  };

  const getMisc = (student: PrivateStudent): string => {
    return edits[student.id]?.misc ?? String(student.misc);
  };

  const getTotal = (student: PrivateStudent): number => {
    const rate = parseInt(getRate(student), 10) || 0;
    const hours = parseInt(getHours(student), 10) || 0;
    const misc = parseInt(getMisc(student), 10) || 0;
    return rate * hours + misc;
  };

  const grandTotal = students.reduce((sum, s) => sum + getTotal(s), 0);

  const handleSave = async () => {
    setSaving(true);
    for (const [id, edit] of Object.entries(edits)) {
      const student = students.find((s) => s.id === id);
      if (!student) continue;
      const formData = new FormData();
      formData.set("id", id);
      let changed = false;
      for (const field of ["rate", "hours", "misc"] as const) {
        if (edit[field] !== undefined) {
          const num = parseInt(edit[field], 10);
          if (!isNaN(num) && num !== student[field]) {
            formData.set(field, String(num));
            changed = true;
          }
        }
      }
      if (changed) await updatePrivateStudent(formData);
    }
    setEdits({});
    setSaving(false);
  };

  return (
    <Card className="border-2 border-warm-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-foreground">
          Private Students ({students.length})
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
        {/* Column headers */}
        {students.length > 0 && (
          <div className="flex items-center gap-3 px-4 text-xs font-semibold text-muted-foreground">
            <span className="flex-1">Name</span>
            <span className="w-20 text-center">Rate ($)</span>
            <span className="w-20 text-center">Hours</span>
            <span className="w-20 text-center">Misc. ($)</span>
            <span className="w-20 text-center">Total</span>
            <span className="w-[70px]" />
          </div>
        )}

        {students.map((student) => (
          <div
            key={student.id}
            className="flex items-center gap-3 rounded-2xl border-2 border-warm-border bg-peach-50 px-4 py-3"
          >
            <span className="flex-1 font-semibold text-foreground">
              {student.name}
            </span>
            <Input
              type="number"
              min={0}
              value={getRate(student)}
              onChange={(e) => setField(student.id, "rate", e.target.value)}
              className="w-20 rounded-xl border-2 border-warm-border bg-white text-center text-sm"
            />
            <Input
              type="number"
              min={0}
              value={getHours(student)}
              onChange={(e) => setField(student.id, "hours", e.target.value)}
              className="w-20 rounded-xl border-2 border-warm-border bg-white text-center text-sm"
            />
            <Input
              type="number"
              min={0}
              value={getMisc(student)}
              onChange={(e) => setField(student.id, "misc", e.target.value)}
              className="w-20 rounded-xl border-2 border-warm-border bg-white text-center text-sm"
            />
            <span className="w-20 text-center text-sm font-semibold text-foreground">
              ${getTotal(student)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const formData = new FormData();
                formData.set("id", student.id);
                await removePrivateStudent(formData);
              }}
              className="rounded-full border-2 border-warm-border text-peach-600 hover:bg-peach-100"
            >
              Remove
            </Button>
          </div>
        ))}

        {/* Add new private student */}
        <form
          ref={addFormRef}
          action={async (formData) => {
            await addPrivateStudent(formData);
            addFormRef.current?.reset();
          }}
          className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-warm-border bg-peach-50 px-4 py-3"
        >
          <Input
            name="name"
            placeholder="Student name"
            required
            className="flex-1 rounded-xl border-2 border-warm-border bg-white"
          />
          <Input
            name="rate"
            type="number"
            min={0}
            defaultValue={0}
            required
            className="w-20 rounded-xl border-2 border-warm-border bg-white text-center"
          />
          <Input
            name="hours"
            type="number"
            min={0}
            defaultValue={0}
            required
            className="w-20 rounded-xl border-2 border-warm-border bg-white text-center"
          />
          <Input
            name="misc"
            type="number"
            min={0}
            defaultValue={0}
            required
            className="w-20 rounded-xl border-2 border-warm-border bg-white text-center"
          />
          <span className="w-20" />
          <Button
            type="submit"
            size="sm"
            className="rounded-full bg-pastel-green text-foreground hover:bg-pastel-green/80"
          >
            Add
          </Button>
        </form>

        {/* Grand total */}
        {students.length > 0 && (
          <div className="flex items-center justify-end gap-3 rounded-2xl border-2 border-warm-border bg-cream px-4 py-3">
            <span className="text-sm font-bold text-foreground">Grand Total:</span>
            <span className="w-20 text-center text-sm font-extrabold text-foreground">
              ${grandTotal}
            </span>
            <span className="w-[70px]" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
