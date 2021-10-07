import { createAction } from "redux-dry-ts-actions"
import type { Logic } from "./eventHelpers"
import type { TaskList } from "$lib/taskList/logic"
import { taskList } from "$lib/taskList/logic"
import type { Undo } from "$lib/undo"
import { undo } from "$lib/undo"

export type AppEvents = {
    textInputFocusChanged: { event: "focus" | "blur" }
} & TaskList["Events"] &
    Undo["Events"]

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
}
