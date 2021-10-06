import { writable } from "svelte/store"
import { defaultTasks } from "./tasks"
import type { Task } from "./tasks"

export type State = {
    tasks: Task[]
    activeTaskIndex: number | undefined
    isRunning: boolean
}

const defaultState: State = {
    tasks: defaultTasks,
    activeTaskIndex: 0,
    isRunning: false,
}

export const state = writable<State>(defaultState)
