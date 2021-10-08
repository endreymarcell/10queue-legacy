import { createAction } from "redux-dry-ts-actions"
import type { AppAction } from "./eventHelpers"
import { dispatch } from "./eventHelpers"
import type { Logic } from "./eventHelpers"
import { appLogic } from "./logic"

type Events = {
    keyPressed: { key: string }
}

const logic: Logic<Events> = {
    keyPressed: {
        action: createAction("keyPressed", key => ({ key })),
        updater: payload => state => {
            executeShortcut(payload.key, state.isTextInputFocused)
        },
    },
}

type ShortcutKey = string
type ShortcutHandling = {
    action: AppAction
    isDisabledDuringTextInput: boolean
}
type Shortcut = {
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

export type KeyboardShortcuts = { Events: Events }
export const keyboardShortcuts = { logic: logic }
