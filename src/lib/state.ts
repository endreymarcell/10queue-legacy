import { writable } from "svelte/store"
import { defaultTasks } from "./tasks"
import type { Task } from "./tasks"

export type State = {
    isTextInputFocused: boolean
    tasks: Task[]
    activeTaskIndex: number | undefined
    isRunning: boolean
    undoPoints: Partial<State>[]
}

const defaultState: State = {
    isTextInputFocused: false,
    tasks: defaultTasks,
    activeTaskIndex: 0,
    isRunning: false,
    undoPoints: [],
}

export const state = writable<State>(defaultState)
