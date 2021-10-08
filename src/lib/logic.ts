import { createAction } from "redux-dry-ts-actions"
import type { Logic } from "./logicHelpers"
import type { TaskList } from "$lib/taskList/logic"
import { taskList } from "$lib/taskList/logic"
import type { Undo } from "$lib/undo/logic"
import { undo } from "$lib/undo/logic"
import type { KeyboardShortcuts } from "./keyboardShortcuts/logic"
import { keyboardShortcuts } from "./keyboardShortcuts/logic"
import { writable } from "svelte/store"

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

export type AppEvents = {
    textInputFocusChanged: { event: "focus" | "blur" }
} & TaskList["Events"] &
    Undo["Events"] &
    KeyboardShortcuts["Events"]

// It is safe to modify the state in the updaters because these functions are fed to immer
export const appLogic: Logic<AppEvents> = {
    textInputFocusChanged: {
        action: createAction("textInputFocusChanged", event => ({ event })),
        updater: payload => state => {
            state.isTextInputFocused = payload.event === "focus"
        },
    },
    ...taskList.logic,
    ...undo.logic,
    ...keyboardShortcuts.logic,
}
