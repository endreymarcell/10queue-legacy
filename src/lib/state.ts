import { writable } from "svelte/store"
import { defaultTasks } from "./taskList/tasks"
import type { Task } from "./taskList/tasks"
import * as undo from "./undo"

export type AppState = {
    isTextInputFocused: boolean
    tasks: Task[]
    activeTaskIndex: number | undefined
    isRunning: boolean
} & undo.State

const defaultAppState: AppState = {
    isTextInputFocused: false,
    tasks: defaultTasks,
    activeTaskIndex: 0,
    isRunning: false,
    ...undo.defaultState,
}

export const appState = writable<AppState>(defaultAppState)
