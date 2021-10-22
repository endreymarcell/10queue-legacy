import type { AppState } from "$lib/logic"
import type { Logic } from "../../helpers/logicHelpers"
import { createAction } from "redux-dry-ts-actions"
import { logger } from "$lib/helpers/logger"
import { copySaveableState } from "$lib/modules/taskList/logic/state"
import type { SaveableState } from "$lib/modules/taskList/logic/state"
import type { Module } from "../Modules"

type State = {
    previousStates: SaveableState[]
    // The index of the currently active item in the imaginary array of [...previousStates, currentState]
    activeStateIndex: number
}

const defaultState: State = {
    previousStates: [],
    activeStateIndex: 0,
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
            if (canUndo(state)) {
                if (state.activeStateIndex === state.previousStates.length) {
                    createUndoPoint(state)
                    state.activeStateIndex--
                }
                state.activeStateIndex--
                restoreState(state)
            } else {
                logger.debug("Cannot undo")
            }
        },
    },
    redo: {
        action: createAction("redo"),
        updater: () => state => {
            // TODO off-by-one errors are my favorite
            if (canRedo(state)) {
                state.activeStateIndex++
                restoreState(state)
            } else {
                logger.debug("Cannot redo")
            }
        },
    },
}

export function canUndo(state: AppState): boolean {
    return state.previousStates[state.activeStateIndex - 1] !== undefined
}

export function canRedo(state: AppState): boolean {
    return state.activeStateIndex < state.previousStates.length - 1
}

export function createUndoPoint(state: AppState) {
    const undoableState = copySaveableState(state)
    logger.debug(`Creating undo point: ${JSON.stringify(undoableState)}`)
    state.previousStates.splice(state.activeStateIndex + 1)
    state.previousStates.push(undoableState)
    state.activeStateIndex = state.previousStates.length
}

function restoreState(state: AppState) {
    const undoPoint = state.previousStates[state.activeStateIndex]
    logger.debug("I am restoring this undoPoint:", undoPoint)
    for (const key of Object.keys(undoPoint)) {
        state[key] = undoPoint[key]
    }
}

export type Undo = { State: State; Events: Events }
export const undo: Module<Undo> = { defaultState, logic }
