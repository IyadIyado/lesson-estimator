import type { DataProvider } from "./types";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

function db() {
  return createSupabaseServiceClient();
}

export const supabaseProvider: DataProvider = {
  async getSettings() {
    const { data } = await db()
      .from("settings")
      .select("default_lessons")
      .single();
    return data ?? { default_lessons: 5 };
  },

  async updateSettings(s) {
    const { data: existing } = await db()
      .from("settings")
      .select("id")
      .single();
    if (existing) {
      await db().from("settings").update(s).eq("id", existing.id);
    } else {
      await db()
        .from("settings")
        .insert({ default_lessons: s.default_lessons ?? 5 });
    }
  },

  async getActiveStudents() {
    const { data } = await db()
      .from("active_students")
      .select("*")
      .order("created_at", { ascending: true });
    return data ?? [];
  },

  async addActiveStudent(name, remainingLessons) {
    await db()
      .from("active_students")
      .insert({ name, remaining_lessons: remainingLessons });
  },

  async removeActiveStudent(id) {
    await db().from("active_students").delete().eq("id", id);
  },

  async updateActiveStudent(id, data) {
    await db().from("active_students").update(data).eq("id", id);
  },

  async getQueuedStudents() {
    const { data } = await db()
      .from("queued_students")
      .select("*")
      .order("position", { ascending: true });
    return data ?? [];
  },

  async addQueuedStudent(name) {
    // Get max position
    const { data: last } = await db()
      .from("queued_students")
      .select("position")
      .order("position", { ascending: false })
      .limit(1)
      .single();
    const nextPos = (last?.position ?? -1) + 1;
    await db().from("queued_students").insert({ name, position: nextPos });
  },

  async removeQueuedStudent(id) {
    await db().from("queued_students").delete().eq("id", id);
    // Re-normalize positions
    const { data: remaining } = await db()
      .from("queued_students")
      .select("id")
      .order("position", { ascending: true });
    if (remaining) {
      for (let i = 0; i < remaining.length; i++) {
        await db()
          .from("queued_students")
          .update({ position: i })
          .eq("id", remaining[i].id);
      }
    }
  },

  async reorderQueue(orderedIds) {
    for (let i = 0; i < orderedIds.length; i++) {
      await db()
        .from("queued_students")
        .update({ position: i })
        .eq("id", orderedIds[i]);
    }
  },

  async getArchivedStudents() {
    const { data } = await db()
      .from("archived_students")
      .select("*")
      .order("created_at", { ascending: true });
    return data ?? [];
  },

  async archiveActiveStudent(id) {
    const { data: student } = await db()
      .from("active_students")
      .select("*")
      .eq("id", id)
      .single();
    if (!student) return;
    await db().from("active_students").delete().eq("id", id);
    await db()
      .from("archived_students")
      .insert({ name: student.name, remaining_lessons: student.remaining_lessons });
  },

  async restoreArchivedStudent(id) {
    const { data: student } = await db()
      .from("archived_students")
      .select("*")
      .eq("id", id)
      .single();
    if (!student) return;
    await db().from("archived_students").delete().eq("id", id);
    await db()
      .from("active_students")
      .insert({ name: student.name, remaining_lessons: student.remaining_lessons });
  },

  async removeArchivedStudent(id) {
    await db().from("archived_students").delete().eq("id", id);
  },
};
