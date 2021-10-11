import { createAction } from "redux-dry-ts-actions"
import type { Logic } from "./logicHelpers"
import type { TaskList } from "$lib/taskList/logic"
import { taskList } from "$lib/taskList/logic"
import type { Undo } from "$lib/undo/logic"
import { undo } from "$lib/undo/logic"
import type { KeyboardShortcuts } from "./keyboardShortcuts/logic"
import { keyboardShortcuts } from "./keyboardShortcuts/logic"
import { writable } from "svelte/store"

export type AppState = TaskList["State"] & Undo["State"] & KeyboardShortcuts["State"]
const defaultAppState: AppState = {
    ...taskList.defaultState,
    ...undo.defaultState,
    ...keyboardShortcuts.defaultState,
}
export const appState = writable<AppState>(defaultAppState)

export type AppEvents = TaskList["Events"] & Undo["Events"] & KeyboardShortcuts["Events"]
export const appLogic: Logic<AppEvents> = {
    ...taskList.logic,
    ...undo.logic,
    ...keyboardShortcuts.logic,
}
