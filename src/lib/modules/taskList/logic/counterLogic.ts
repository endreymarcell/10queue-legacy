import { createEffect, dispatch, schedule } from "$lib/helpers/logicHelpers"
import type { Logic } from "$lib/helpers/logicHelpers"
import { createAction } from "redux-dry-ts-actions"

type Events = {
    clockTick: void
}

const effects = {
    scheduleNextTick: () => createEffect(() => setTimeout(() => dispatch(logic.clockTick.action()), 1000), []),
}

const logic: Logic<Events> = {
    clockTick: {
        action: createAction("clockTick"),
        updater: () => state => {
            if (state.isRunning) {
                const task = state.tasks[state.activeTaskIndex]
                task.secondsSpentInCurrentRun = secondElapsedSince(task.startTimestampOfCurrentRun)
                schedule(effects.scheduleNextTick())
            }
        },
    },
}

function secondElapsedSince(timestamp: number): number {
    return Math.floor((Date.now() - timestamp) / 1000)
}

export type Counter = { Events: Events }
export const counter = { logic, effects }
