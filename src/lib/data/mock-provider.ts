import type { DataProvider, ActiveStudent, ArchivedStudent, QueuedStudent, Settings } from "./types";

let settings: Settings = { default_lessons: 5 };

let activeStudents: ActiveStudent[] = [
  { id: "a1", name: "Emma", remaining_lessons: 1, created_at: "2026-01-01" },
  { id: "a2", name: "Liam", remaining_lessons: 3, created_at: "2026-01-02" },
  { id: "a3", name: "Olivia", remaining_lessons: 5, created_at: "2026-01-03" },
  { id: "a4", name: "Noah", remaining_lessons: 1, created_at: "2026-01-04" },
  { id: "a5", name: "Ava", remaining_lessons: 2, created_at: "2026-01-05" },
];

let queuedStudents: QueuedStudent[] = [
  { id: "q1", name: "Sophia", position: 0, created_at: "2026-02-01" },
  { id: "q2", name: "Jackson", position: 1, created_at: "2026-02-02" },
  { id: "q3", name: "Isabella", position: 2, created_at: "2026-02-03" },
  { id: "q4", name: "Lucas", position: 3, created_at: "2026-02-04" },
  { id: "q5", name: "Mia", position: 4, created_at: "2026-02-05" },
];

let archivedStudents: ArchivedStudent[] = [];

let nextId = 100;
function genId() {
  return `mock-${nextId++}`;
}

export const mockProvider: DataProvider = {
  async getSettings() {
    return { ...settings };
  },

  async updateSettings(s) {
    settings = { ...settings, ...s };
  },

  async getActiveStudents() {
    return activeStudents.map((s) => ({ ...s }));
  },

  async addActiveStudent(name, remainingLessons) {
    activeStudents.push({
      id: genId(),
      name,
      remaining_lessons: remainingLessons,
      created_at: new Date().toISOString(),
    });
  },

  async removeActiveStudent(id) {
    activeStudents = activeStudents.filter((s) => s.id !== id);
  },

  async updateActiveStudent(id, data) {
    activeStudents = activeStudents.map((s) =>
      s.id === id ? { ...s, ...data } : s
    );
  },

  async getQueuedStudents() {
    return [...queuedStudents].sort((a, b) => a.position - b.position);
  },

  async addQueuedStudent(name) {
    const maxPos = queuedStudents.reduce(
      (max, s) => Math.max(max, s.position),
      -1
    );
    queuedStudents.push({
      id: genId(),
      name,
      position: maxPos + 1,
      created_at: new Date().toISOString(),
    });
  },

  async removeQueuedStudent(id) {
    queuedStudents = queuedStudents.filter((s) => s.id !== id);
    // Re-normalize positions
    queuedStudents
      .sort((a, b) => a.position - b.position)
      .forEach((s, i) => (s.position = i));
  },

  async reorderQueue(orderedIds) {
    const map = new Map(queuedStudents.map((s) => [s.id, s]));
    queuedStudents = orderedIds
      .map((id, i) => {
        const student = map.get(id);
        if (student) return { ...student, position: i };
        return null;
      })
      .filter((s): s is QueuedStudent => s !== null);
  },

  async getArchivedStudents() {
    return archivedStudents.map((s) => ({ ...s }));
  },

  async archiveActiveStudent(id) {
    const student = activeStudents.find((s) => s.id === id);
    if (!student) return;
    activeStudents = activeStudents.filter((s) => s.id !== id);
    archivedStudents.push({ ...student });
  },

  async restoreArchivedStudent(id) {
    const student = archivedStudents.find((s) => s.id === id);
    if (!student) return;
    archivedStudents = archivedStudents.filter((s) => s.id !== id);
    activeStudents.push({ ...student });
  },

  async removeArchivedStudent(id) {
    archivedStudents = archivedStudents.filter((s) => s.id !== id);
  },
};
