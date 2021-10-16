import type { EntryStyle } from "./taskColors"

export type Task = {
    title: string
    style: EntryStyle
}

export function createTask(title: string) {
    return { title, style: { foregroundColor: "floralWhite", backgroundColor: "lightGrey" } }
}
