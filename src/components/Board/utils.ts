import { DropResult } from "react-beautiful-dnd";
import { Task, TaskStatus } from "../../types/task";
import { updateTask } from "../../store/taskSlice";
import { saveTask } from "../../services/taskService";
import { AppDispatch } from "../../store";

export const onDragEndHandler = async (
  result: DropResult,
  allTasks: Task[],
  dispatch: AppDispatch
) => {
  const { source, destination, draggableId } = result;

  if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
    return;
  }

  const movedTask = allTasks.find((task) => task.id === draggableId);
  if (!movedTask) return;

  const destStatus = destination.droppableId as TaskStatus;

  const tasksInTarget = allTasks
    .filter((task) => task.status === destStatus && task.id !== movedTask.id)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  tasksInTarget.splice(destination.index, 0, { ...movedTask, status: destStatus });

  const reordered = tasksInTarget.map((task, index) => ({
    ...task,
    order: index,
  }));

  // ✅ Optimistically dispatch all at once
  reordered.forEach((updated) => {
    dispatch(updateTask(updated));
  });

  // ✅ Save in parallel (no UI block or flicker)
  await Promise.all(
    reordered.map((updated) => saveTask(updated.id, updated))
  );
};
