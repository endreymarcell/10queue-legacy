export type Task = {
    title: string
}

export function createTask(title: string) {
    return { title }
}
