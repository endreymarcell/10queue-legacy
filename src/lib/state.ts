import { writable } from "svelte/store"
import * as tasks from "./taskList/logic"
import * as undo from "./undo"

export type AppState = {
    isTextInputFocused: boolean
} & tasks.State &
    undo.State

const defaultAppState: AppState = {
    isTextInputFocused: false,
    ...tasks.defaultState,
    ...undo.defaultState,
}

export const appState = writable<AppState>(defaultAppState)
