import type { AppState } from "$lib/state"
import type { Logic } from "$lib/eventHelpers"
import { createAction } from "redux-dry-ts-actions"

type State = {
    undoPoints: Partial<AppState>[]
}

const defaultState: State = {
    undoPoints: [],
}

type Events = {
    createUndoPoint: void
    restoreUndoPoint: void
}

const logic: Logic<Events> = {
    createUndoPoint: {
        action: createAction("createUndoPoint"),
        updater: () => createUndoPoint,
    },
    restoreUndoPoint: {
        action: createAction("restoreUndoPoint"),
        updater: () => state => {
            if (state.undoPoints.length > 0) {
                const lastUndoPoint = state.undoPoints.pop()
                for (const key of Object.keys(lastUndoPoint)) {
                    state[key] = lastUndoPoint[key]
                }
            } else {
                console.log("No more steps to undo")
            }
        },
    },
}

export function createUndoPoint(state: AppState) {
    state.undoPoints.push({ tasks: [...state.tasks], activeTaskIndex: state.activeTaskIndex })
}

export type Undo = { State: State; Events: Events }
export const undo = { defaultState, logic }
