import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { TaskStatus } from "../../types/task";
import Column from "./Column";
import styles from "./Board.module.scss";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { onDragEndHandler } from "./utils";
import { Select } from "antd";
import { useState } from "react";
const { Option } = Select;

function Board() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();

  const [filter, setFilter] = useState<TaskStatus | "ALL">("ALL");

  const filteredTasks = tasks.filter(
    (task) => filter === "ALL" || task.status === filter
  );

  const onDragEnd = (result: DropResult) => {
    onDragEndHandler(result, tasks, dispatch);
  };

  const todoTasks =
    filter === "ALL" || filter === TaskStatus.TODO
      ? filteredTasks.filter((task) => task.status === TaskStatus.TODO)
      : [];

  const inProgressTasks =
    filter === "ALL" || filter === TaskStatus.IN_PROGRESS
      ? filteredTasks.filter((task) => task.status === TaskStatus.IN_PROGRESS)
      : [];

  const doneTasks =
    filter === "ALL" || filter === TaskStatus.DONE
      ? filteredTasks.filter((task) => task.status === TaskStatus.DONE)
      : [];


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Select
        value={filter}
        onChange={(value) => setFilter(value)}
        style={{ marginBottom: 16, width: 200 }}
      >
        <Option value="ALL">All Tasks</Option>
        <Option value={TaskStatus.TODO}>To Do</Option>
        <Option value={TaskStatus.IN_PROGRESS}>In Progress</Option>
        <Option value={TaskStatus.DONE}>Done</Option>
      </Select>

      <div className={styles.board}>
        {(filter === "ALL" || filter === TaskStatus.TODO) && (
          <Column title="To Do" status={TaskStatus.TODO} tasks={todoTasks} />
        )}
        {(filter === "ALL" || filter === TaskStatus.IN_PROGRESS) && (
          <Column title="In Progress" status={TaskStatus.IN_PROGRESS} tasks={inProgressTasks} />
        )}
        {(filter === "ALL" || filter === TaskStatus.DONE) && (
          <Column title="Done" status={TaskStatus.DONE} tasks={doneTasks} />
        )}
      </div>
    </DragDropContext>
  );
}

export default Board;
