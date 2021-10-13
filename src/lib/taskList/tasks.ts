export type Task = {
    title: string
}

export function createTask(title: string) {
    return { title }
}

// TODO dummy data for the early phase of development
export const defaultTasks: Task[] = [createTask("foo"), createTask("bar"), createTask("baz")]
