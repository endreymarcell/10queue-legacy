import produce from "immer"
import { writable } from "svelte/store"
import type { Task, TaskId } from "./tasks"

const defaultTasks: Task[] = [
    { id: 0 as TaskId, title: "foo" },
    { id: 1 as TaskId, title: "bar" },
    { id: 2 as TaskId, title: "baz" },
]
export const tasks = writable(defaultTasks)

type Action = { type: "taskTitleEdited"; taskIndex: number; title: string }

export function dispatch(action: Action) {
    // middleware would come here
    handleAction(action)
}

function handleAction(action: Action) {
    switch (action.type) {
        case "taskTitleEdited": {
            tasks.update((value) => produce(value, (draft) => {
                draft[action.taskIndex].title = action.title
            }))
        }
    }
}
