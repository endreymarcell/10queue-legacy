import type { uniqueTypeSymbol } from "./utils"

export type TaskId = number & { [uniqueTypeSymbol]: "TaskId" }
export type Task = {
    id: TaskId
    title: string
    url?: string
}
