import type { Logic } from "./logicHelpers"
import type { TaskList } from "$lib/taskList/logic"
import { taskList } from "$lib/taskList/logic"
import type { Undo } from "$lib/undo/logic"
import { undo } from "$lib/undo/logic"
import type { KeyboardShortcuts } from "./keyboardShortcuts/logic"
import { keyboardShortcuts } from "./keyboardShortcuts/logic"
import { writable } from "svelte/store"
import { persistence } from "$lib/persistence/logic"
import type { Persistence } from "$lib/persistence/logic"
import { helpModal } from "./help/logic"
import type { HelpModal } from "./help/logic"

export type AppState = TaskList["State"] & Undo["State"] & KeyboardShortcuts["State"] & HelpModal["State"]
const defaultAppState: AppState = {
    ...taskList.defaultState,
    ...undo.defaultState,
    ...keyboardShortcuts.defaultState,
    ...helpModal.defaultState,
}
export const appState = writable<AppState>(defaultAppState)

export type AppEvents = TaskList["Events"] &
    Undo["Events"] &
    KeyboardShortcuts["Events"] &
    Persistence["Events"] &
    HelpModal["Events"]

export const appLogic: Logic<AppEvents> = {
    ...taskList.logic,
    ...undo.logic,
    ...keyboardShortcuts.logic,
    ...persistence.logic,
    ...helpModal.logic,
}
