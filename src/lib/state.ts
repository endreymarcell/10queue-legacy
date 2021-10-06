import { writable } from "svelte/store"
import { defaultTasks } from "./tasks"
import type { Task } from "./tasks"

export type State = {
    tasks: Task[]
    isRunning: boolean
}

const defaultState: State = {
    tasks: defaultTasks,
    isRunning: false,
}

export const state = writable<State>(defaultState)
