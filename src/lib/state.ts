import produce from "immer"
import { writable } from "svelte/store"
import { defaultTasks } from "./tasks"
import type { Task } from "./tasks"
import type { WritableDraft } from "immer/dist/internal"
import { ActionCreator, ActionCreatorWithPayload, ActionTypeFromActionCreators, createAction } from "redux-dry-ts-actions"

type State = {
    tasks: Task[];
    isRunning: boolean;
}
const defaultState: State = {
    tasks: defaultTasks,
    isRunning: false
}

export const state = writable<State>(defaultState)

type Events = {
    taskTitleEdited: { index: number, title: string },
    taskDeleted: { index: number },
    taskStarted: void,
    taskPaused: void,
}

type TODO = any;

type Logic = {
    [eventName in keyof Events]: {
        action: Events[eventName] extends Object ? ActionCreatorWithPayload<eventName, Events[eventName], TODO> : ActionCreator<eventName>;
        updater: (payload: Events[eventName]) => (draft: WritableDraft<State>) => void;
    }
}

export const logic: Logic = {
    taskTitleEdited: {
        action: createAction('taskTitleEdited', (index, title) => ({ index, title })),
        updater: (payload) => (draft) => void (draft.tasks[payload.index].title = payload.title),
    },
    taskDeleted: {
        action: createAction('taskDeleted', (index) => ({ index })),
        updater: (payload) => (draft) => void draft.tasks.splice(payload.index, 1)
    },
    taskStarted: {
        action: createAction('taskStarted'),
        updater: () => (draft) => void (draft.isRunning = true)
    },
    taskPaused: {
        action: createAction('taskPaused'),
        updater: () => (draft) => void (draft.isRunning = false)
    }
}


export const actions = Object.fromEntries(Object.keys(logic).map(eventName => [eventName, logic[eventName].action]))
type Action = ActionTypeFromActionCreators<typeof actions>

export function dispatch(action: Action) {
    // middleware would come here
    handleAction(action)
}

function handleAction(action: Action) {
    const event = logic[action.type];
    const updater = event.updater(action.payload);
    state.update((value) => produce(value, updater))
}
