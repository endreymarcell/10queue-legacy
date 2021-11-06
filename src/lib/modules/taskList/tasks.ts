import type { EntryStyle } from "./taskColors"

export type Task = {
    title: string
    style: EntryStyle
    secondsSpentInPreviousRuns: number
    secondsSpentInCurrentRun: number
    startTimestampOfCurrentRun: number
}

export function createTask(title: string): Task {
    return {
        title,
        style: {
            foregroundColor: "darkSalmon",
            backgroundColor: "sienna",
        },
        secondsSpentInPreviousRuns: 0,
        secondsSpentInCurrentRun: 0,
        startTimestampOfCurrentRun: null,
    }
}
