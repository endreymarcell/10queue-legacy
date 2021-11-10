import type { Logic } from "./helpers/logicHelpers"
import type { TaskList } from "$lib/modules/taskList/logic"
import { taskList } from "$lib/modules/taskList/logic"
import type { Undo } from "$lib/modules/undo/logic"
import { undo } from "$lib/modules/undo/logic"
import type { KeyboardShortcuts } from "./modules/keyboardShortcuts/logic"
import { keyboardShortcuts } from "./modules/keyboardShortcuts/logic"
import { writable } from "svelte/store"
import { persistence } from "$lib/modules/persistence/logic"
import type { Persistence } from "$lib/modules/persistence/logic"
import { helpModal } from "./modules/help/logic"
import type { HelpModal } from "./modules/help/logic"
import { creation } from "$lib/modules/taskList/logic/creationLogic"
import type { Creation } from "$lib/modules/taskList/logic/creationLogic"
import { createAction } from "redux-dry-ts-actions"
import { schedule } from "./helpers/logicHelpers"
import { effects } from "$lib/effects"

export type AppState = TaskList["State"] & Undo["State"] & KeyboardShortcuts["State"] & HelpModal["State"]
const defaultAppState: AppState = {
    ...taskList.defaultState,
    ...undo.defaultState,
    ...keyboardShortcuts.defaultState,
    ...helpModal.defaultState,
}
export const appState = writable<AppState>(defaultAppState)

export type AppEvents = {
    onMount: void
} & TaskList["Events"] &
    Undo["Events"] &
    KeyboardShortcuts["Events"] &
    Persistence["Events"] &
    HelpModal["Events"] &
    Creation["Events"]

export const appLogic: Logic<AppEvents> = {
    onMount: {
        action: createAction("onMount"),
        updater: () => () => {
            schedule(effects.setupListenersAndStuff())
        },
    },
    ...taskList.logic,
    ...undo.logic,
    ...keyboardShortcuts.logic,
    ...persistence.logic,
    ...helpModal.logic,
    ...creation.logic,
}
