import { writable } from "svelte/store"
import type { TaskList } from "$lib/taskList/logic"
import { taskList } from "$lib/taskList/logic"
import type { Undo } from "$lib/undo"
import { undo } from "$lib/undo"

export type AppState = {
    isTextInputFocused: boolean
} & TaskList["State"] &
    Undo["State"]

const defaultAppState: AppState = {
    isTextInputFocused: false,
    ...taskList.defaultState,
    ...undo.defaultState,
}

export const appState = writable<AppState>(defaultAppState)
