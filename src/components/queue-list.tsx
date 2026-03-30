"use client";

import { useRef } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import type { QueuedStudent } from "@/lib/data/types";
import {
  addQueuedStudent,
  removeQueuedStudent,
  reorderQueue,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QueueList({ students }: { students: QueuedStudent[] }) {
  const addFormRef = useRef<HTMLFormElement>(null);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(students);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    await reorderQueue(items.map((s) => s.id));
  };

  return (
    <Card className="border-2 border-warm-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">
          Queue ({students.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="queue">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2"
              >
                {students.map((student, index) => (
                  <Draggable
                    key={student.id}
                    draggableId={student.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`flex items-center gap-3 rounded-2xl border-2 border-warm-border bg-peach-50 px-4 py-3 transition-shadow ${
                          snapshot.isDragging ? "shadow-lg" : ""
                        }`}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-peach-300 text-sm font-bold text-white">
                          {index + 1}
                        </span>
                        <span className="flex-1 font-semibold text-foreground">
                          {student.name}
                        </span>
                        <span className="cursor-grab text-muted-foreground">
                          ⠿
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const formData = new FormData();
                            formData.set("id", student.id);
                            await removeQueuedStudent(formData);
                          }}
                          className="rounded-full border-2 border-warm-border text-peach-600 hover:bg-peach-100"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Add to queue */}
        <form
          ref={addFormRef}
          action={async (formData) => {
            await addQueuedStudent(formData);
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
          <Button
            type="submit"
            size="sm"
            className="rounded-full bg-pastel-blue text-foreground hover:bg-pastel-blue/80"
          >
            Add to queue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
