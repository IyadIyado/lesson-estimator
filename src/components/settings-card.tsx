"use client";

import { useRef } from "react";
import { updateSettings } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SettingsCard({ defaultLessons }: { defaultLessons: number }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Card className="border-2 border-warm-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          ref={formRef}
          action={updateSettings}
          className="flex items-end gap-3"
        >
          <div className="flex-1">
            <label
              htmlFor="default_lessons"
              className="mb-1 block text-sm font-medium text-muted-foreground"
            >
              Default lessons for new students
            </label>
            <Input
              id="default_lessons"
              name="default_lessons"
              type="number"
              min={1}
              defaultValue={defaultLessons}
              className="rounded-xl border-2 border-warm-border"
            />
          </div>
          <Button
            type="submit"
            className="rounded-full bg-peach-500 text-white hover:bg-peach-600"
          >
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
