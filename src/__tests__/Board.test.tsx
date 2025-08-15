import { onDragEndHandler } from "../components/Board/utils";
import { updateTask } from "../store/taskSlice";
import { TaskStatus } from "../types/task";
import { DropResult } from "react-beautiful-dnd";

jest.mock("../store/taskSlice", () => ({
  updateTask: jest.fn(),
}));

const tasks = [
  {
    id: "task-1",
    title: "Task 1",
    status: TaskStatus.TODO,
    description: "",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "task-2",
    title: "Task 2",
    status: TaskStatus.TODO,
    description: "",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "task-3",
    title: "Task 3",
    status: TaskStatus.DONE,
    description: "",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
];

describe("onDragEndHandler", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update task status if column changes", async () => {
    const result: DropResult = {
        draggableId: "task-1",
        type: "DEFAULT",
        source: { droppableId: TaskStatus.TODO, index: 0 },
        destination: { droppableId: TaskStatus.DONE, index: 0 },
        reason: "DROP",
        mode: "FLUID",
        combine: null,
    };

    await onDragEndHandler(result, tasks, mockDispatch);

    expect(updateTask).toHaveBeenCalledTimes(2);

    expect(updateTask).toHaveBeenNthCalledWith(1, expect.objectContaining({
        id: "task-1",
        status: TaskStatus.DONE,
        order: 0,
    }));

    expect(updateTask).toHaveBeenNthCalledWith(2, expect.objectContaining({
        id: "task-3",
        status: TaskStatus.DONE,
        order: 1,
    }));
});

  it("should do nothing if destination is same as source", async () => {
    const result: DropResult = {
      draggableId: "task-2",
      type: "DEFAULT",
      source: { droppableId: TaskStatus.TODO, index: 0 },
      destination: { droppableId: TaskStatus.TODO, index: 0 },
      reason: "DROP",
      mode: "FLUID",
      combine: null,
    };

    await onDragEndHandler(result, tasks, mockDispatch);

    expect(updateTask).not.toHaveBeenCalled();
  });
});

describe("Task filtering", () => {
  it("filters tasks by status", () => {
    const filterByStatus = (status: TaskStatus | "ALL") =>
      tasks.filter((task) => status === "ALL" || task.status === status);

    expect(filterByStatus("ALL")).toHaveLength(3);
    expect(filterByStatus(TaskStatus.TODO)).toHaveLength(2);
    expect(filterByStatus(TaskStatus.DONE)).toHaveLength(1);
    expect(filterByStatus(TaskStatus.IN_PROGRESS)).toHaveLength(0);
  });
});
