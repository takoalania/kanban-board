import { Task, TaskStatus } from "../../types/task";
import TaskCard from "./TaskCard";
import styles from "./Column.module.scss";
import { Droppable } from "react-beautiful-dnd";

interface ColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
}

function Column({ title, status, tasks }: ColumnProps) {
  const tasksToRender = tasks
    .filter((task) => task.status === status)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className={styles.column}>
      <h2 className={styles.title}>{title}</h2>

      <Droppable droppableId={String(status)}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={styles.taskList}
          >
            {tasksToRender.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}

            {tasksToRender.length === 0 && (
              <div className={styles.empty}>No tasks in this column</div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Column;
