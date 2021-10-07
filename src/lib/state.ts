import { writable } from "svelte/store"
import { defaultTasks } from "./taskList/tasks"
import type { Task } from "./taskList/tasks"

export type AppState = {
    isTextInputFocused: boolean
    tasks: Task[]
    activeTaskIndex: number | undefined
    isRunning: boolean
    undoPoints: Partial<AppState>[]
}

const defaultAppState: AppState = {
    isTextInputFocused: false,
    tasks: defaultTasks,
    activeTaskIndex: 0,
    isRunning: false,
    undoPoints: [],
}

export const appState = writable<AppState>(defaultAppState)
