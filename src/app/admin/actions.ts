"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser, isOwner } from "@/lib/auth";
import { getDataProvider } from "@/lib/data/provider";
import {
  addActiveStudentSchema,
  updateActiveStudentSchema,
  removeStudentSchema,
  addQueuedStudentSchema,
  reorderQueueSchema,
  updateSettingsSchema,
} from "@/lib/data/schemas";

async function requireOwner() {
  const user = await getCurrentUser();
  if (!user?.email || !isOwner(user.email)) {
    throw new Error("Unauthorized");
  }
}

export async function addActiveStudent(formData: FormData) {
  await requireOwner();
  const parsed = addActiveStudentSchema.parse({
    name: formData.get("name"),
    remaining_lessons: formData.get("remaining_lessons"),
  });
  await getDataProvider().addActiveStudent(parsed.name, parsed.remaining_lessons);
  revalidatePath("/");
}

export async function updateActiveStudent(formData: FormData) {
  await requireOwner();
  const parsed = updateActiveStudentSchema.parse({
    id: formData.get("id"),
    name: formData.get("name") || undefined,
    remaining_lessons: formData.get("remaining_lessons") ?? undefined,
  });
  const { id, ...data } = parsed;
  await getDataProvider().updateActiveStudent(id, data);
  revalidatePath("/");
}

export async function removeActiveStudent(formData: FormData) {
  await requireOwner();
  const { id } = removeStudentSchema.parse({ id: formData.get("id") });
  await getDataProvider().removeActiveStudent(id);
  revalidatePath("/");
}

export async function addQueuedStudent(formData: FormData) {
  await requireOwner();
  const parsed = addQueuedStudentSchema.parse({ name: formData.get("name") });
  await getDataProvider().addQueuedStudent(parsed.name);
  revalidatePath("/");
}

export async function removeQueuedStudent(formData: FormData) {
  await requireOwner();
  const { id } = removeStudentSchema.parse({ id: formData.get("id") });
  await getDataProvider().removeQueuedStudent(id);
  revalidatePath("/");
}

export async function reorderQueue(orderedIds: string[]) {
  await requireOwner();
  const parsed = reorderQueueSchema.parse({ orderedIds });
  await getDataProvider().reorderQueue(parsed.orderedIds);
  revalidatePath("/");
}

export async function updateSettings(formData: FormData) {
  await requireOwner();
  const parsed = updateSettingsSchema.parse({
    default_lessons: formData.get("default_lessons"),
  });
  await getDataProvider().updateSettings(parsed);
  revalidatePath("/");
}
