import type { uniqueTypeSymbol } from "./utils"

export type TaskId = number & { [uniqueTypeSymbol]: "TaskId" }
export type Task = {
    id: TaskId
    title: string
}

// TODO dummy data for the early phase of development
export const defaultTasks: Task[] = [
    { id: 0 as TaskId, title: "foo" },
    { id: 1 as TaskId, title: "bar" },
    { id: 2 as TaskId, title: "baz" },
]
