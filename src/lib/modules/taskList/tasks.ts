import type { EntryStyle } from "./taskColors"

export type Task = {
    title: string
    style: EntryStyle
    elapsedSeconds: number
}

export function createTask(title: string) {
    return {
        title,
        style: {
            foregroundColor: "darkSalmon",
            backgroundColor: "sienna",
        },
        elapsedSeconds: 0,
    }
}
