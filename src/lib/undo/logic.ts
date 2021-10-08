import type { AppState } from "$lib/logic"
import type { Logic } from "../logicHelpers"
import { createAction } from "redux-dry-ts-actions"

type UndoableState = Pick<AppState, "tasks" | "activeTaskIndex">

type State = {
    undoStack: UndoableState[]
    // The index of the currently active item in the imaginary array of [...undoStack, currentState]
    undoPointer: number
}

const defaultState: State = {
    undoStack: [],
    undoPointer: 0,
}

type Events = {
    createUndoPoint: void
    undo: void
    redo: void
}

const logic: Logic<Events> = {
    createUndoPoint: {
        action: createAction("createUndoPoint"),
        updater: () => createUndoPoint,
    },
    undo: {
        action: createAction("undo"),
        updater: () => state => {
            if (state.undoStack.length > 0 && state.undoPointer > -1) {
                state.undoPointer--
                restoreState(state)
            } else {
                console.log("Cannot undo")
            }
        },
    },
    redo: {
        action: createAction("redo"),
        updater: () => state => {
            // TODO off-by-one errors are my favorite
            if (state.undoPointer < state.undoStack.length - 1) {
                restoreState(state)
                state.undoPointer++
            } else {
                console.log("Cannot redo")
            }
        },
    },
}

export function createUndoPoint(state: AppState) {
    // TODO do this with a proper deep copy
    const undoableState: UndoableState = {
        tasks: [...state.tasks],
        activeTaskIndex: state.activeTaskIndex,
    }
    state.undoStack.splice(state.undoPointer + 1)
    state.undoStack.push(undoableState)
    state.undoPointer = state.undoStack.length
}

function restoreState(state: AppState) {
    const undoPoint = state.undoStack[state.undoPointer]
    console.log("I am restoring this undoPoint:", undoPoint)
    for (const key of Object.keys(undoPoint)) {
        state[key] = undoPoint[key]
    }
}

export type Undo = { State: State; Events: Events }
export const undo = { defaultState, logic }
