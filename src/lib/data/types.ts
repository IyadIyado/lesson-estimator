export interface ActiveStudent {
  id: string;
  name: string;
  remaining_lessons: number;
  created_at: string;
}

export interface QueuedStudent {
  id: string;
  name: string;
  position: number;
  created_at: string;
}

export interface Settings {
  default_lessons: number;
}

export interface DataProvider {
  getSettings(): Promise<Settings>;
  updateSettings(s: Partial<Settings>): Promise<void>;

  getActiveStudents(): Promise<ActiveStudent[]>;
  addActiveStudent(name: string, remainingLessons: number): Promise<void>;
  removeActiveStudent(id: string): Promise<void>;
  updateActiveStudent(
    id: string,
    data: Partial<Pick<ActiveStudent, "name" | "remaining_lessons">>
  ): Promise<void>;

  getQueuedStudents(): Promise<QueuedStudent[]>;
  addQueuedStudent(name: string): Promise<void>;
  removeQueuedStudent(id: string): Promise<void>;
  reorderQueue(orderedIds: string[]): Promise<void>;
}
