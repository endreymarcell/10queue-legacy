import { createAction } from "redux-dry-ts-actions"
import type { Logic } from "./eventHelpers"
import * as tasks from "./taskList/logic"
import * as undo from "./undo"

export type AppEvents = {
    textInputFocusChanged: { event: "focus" | "blur" }
} & tasks.Events &
    undo.Events

// It is safe to modify the state in the updaters because these functions are fed to immer
export const appLogic: Logic<AppEvents> = {
    textInputFocusChanged: {
        action: createAction("textInputFocusChanged", event => ({ event })),
        updater: payload => state => {
            state.isTextInputFocused = payload.event === "focus"
        },
    },
    ...tasks.logic,
    ...undo.logic,
}
