import produce from "immer"
import { writable } from "svelte/store"
import { defaultTasks } from "./tasks"
import type { Task } from "./tasks"
import type { WritableDraft } from "immer/dist/internal"
import {
    ActionCreator,
    ActionCreatorWithPayload,
    ActionTypeFromActionCreators,
    createAction,
} from "redux-dry-ts-actions"

type State = {
    tasks: Task[]
    isRunning: boolean
}
const defaultState: State = {
    tasks: defaultTasks,
    isRunning: false,
}

export const state = writable<State>(defaultState)

type Events = {
    taskTitleEdited: { index: number; title: string }
    taskDeleted: { index: number }
    taskStarted: void
    taskPaused: void
}

type TODO = any

type Logic = {
    [eventName in keyof Events]: {
        action: Events[eventName] extends Object
            ? ActionCreatorWithPayload<eventName, Events[eventName], TODO>
            : ActionCreator<eventName>
        updater: (payload: Events[eventName]) => (draft: WritableDraft<State>) => void
    }
}

export const logic: Logic = {
    taskTitleEdited: {
        action: createAction("taskTitleEdited", (index, title) => ({ index, title })),
        updater: payload => draft => void (draft.tasks[payload.index].title = payload.title),
    },
    taskDeleted: {
        action: createAction("taskDeleted", index => ({ index })),
        updater: payload => draft => void draft.tasks.splice(payload.index, 1),
    },
    taskStarted: {
        action: createAction("taskStarted"),
        updater: () => draft => void (draft.isRunning = true),
    },
    taskPaused: {
        action: createAction("taskPaused"),
        updater: () => draft => void (draft.isRunning = false),
    },
}

export const actions = Object.fromEntries(Object.keys(logic).map(eventName => [eventName, logic[eventName].action]))
type Action = ActionTypeFromActionCreators<typeof actions>

export function dispatch(action: Action) {
    // this is rather redundant, but it feels weird to update state in a function called `dispatch`
    handleAction(action)
}

function handleAction(action: Action) {
    state.update(oldState => reducer(oldState, action))
}

function reducer(state: State, action: Action): State {
    // this is a testable, pure function
    const event = logic[action.type]
    const updater = event.updater(action.payload)
    return produce(state, updater)
}
