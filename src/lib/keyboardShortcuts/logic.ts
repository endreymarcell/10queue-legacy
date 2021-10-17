import { createAction } from "redux-dry-ts-actions"
import type { AppAction } from "../logicHelpers"
import { createEffect, dispatch, schedule } from "../logicHelpers"
import type { Logic } from "../logicHelpers"
import { appLogic } from "../logic"

type State = {
    isTextInputFocused: boolean
}

const defaultState: State = {
    isTextInputFocused: false,
}

type Events = {
    keyPressed: { key: string }
}

const effects = {
    executeShortcut: (key, isTextInputFocused) =>
        createEffect((key: ShortcutKey, isTextInputFocused: boolean) => executeShortcut(key, isTextInputFocused), [
            key,
            isTextInputFocused,
        ]),
}

const logic: Logic<Events> = {
    keyPressed: {
        action: createAction("keyPressed", key => ({ key })),
        updater: payload => state => {
            schedule(effects.executeShortcut(payload.key, state.isTextInputFocused))
        },
    },
}

type ShortcutKey = string
type ShortcutHandling = {
    action: AppAction
    isDisabledDuringTextInput: boolean
}
export type Shortcut = {
    key: ShortcutKey
} & ShortcutHandling

const shortcutMap: Map<ShortcutKey, ShortcutHandling> = new Map()

export function registerShortcuts(shortcutsToRegister: Shortcut[]): void {
    shortcutsToRegister.forEach(shortcut => {
        if (shortcutMap.has(shortcut.key)) {
            throw new Error(`Cannot register shortcut for key ${shortcut.key}, as it is already taken`)
        }
        shortcutMap.set(shortcut.key, shortcut)
    })
}

function executeShortcut(key: ShortcutKey, isTextInputFocused: boolean): void {
    const shortcut = shortcutMap.get(key)
    if (shortcut !== undefined && shortcut.isDisabledDuringTextInput !== isTextInputFocused) {
        dispatch(shortcut.action())
    }
}

export function setupKeyboardShortcutListener() {
    document.addEventListener("keydown", event => {
        dispatch(appLogic.keyPressed.action(event.key))
    })
}

export type KeyboardShortcuts = { Events: Events; State: State }
export const keyboardShortcuts = { logic, defaultState }
