import type { uniqueTypeSymbol } from "./utils"

let taskIdCounter = 0
export type Task = {
    id: number
    title: string
}

function createTask(title: string) {
    return { id: taskIdCounter++, title }
}

// TODO dummy data for the early phase of development
export const defaultTasks: Task[] = [
    createTask('foo'),
    createTask('bar'),
    createTask('baz'),
]
