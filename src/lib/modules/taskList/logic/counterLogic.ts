import { createEffect, dispatch, schedule } from "$lib/helpers/logicHelpers"
import type { Logic } from "$lib/helpers/logicHelpers"
import { createAction } from "redux-dry-ts-actions"

type Events = {
    countdownTick: void
}

const effects = {
    scheduleNextTick: () => createEffect(() => setTimeout(() => dispatch(logic.countdownTick.action()), 1000), []),
}

const logic: Logic<Events> = {
    countdownTick: {
        action: createAction("countdownTick"),
        updater: () => state => {
            if (state.isRunning) {
                state.tasks[state.activeTaskIndex].elapsedSeconds++
                schedule(effects.scheduleNextTick())
            }
        },
    },
}

export type Counter = { Events: Events }
export const counter = { logic, effects }
