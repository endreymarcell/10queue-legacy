import { createAction } from "redux-dry-ts-actions"
import type { AppAction } from "$lib/logical/logicHelpers"
import { createEffect, dispatch, schedule } from "$lib/logical/logicHelpers"
import type { Logic } from "$lib/logical/logicHelpers"
import { appLogic } from "../../logic"
import type { Module } from "$lib/logical/Modules"
import { logger } from "$lib/helpers/logger"

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
        handler: payload => state => {
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
            logger.warn(
                `Attempting to register shortcut for key '${shortcut.key}' but it is already taken - normal during hot reload`,
            )
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
export const keyboardShortcuts: Module<KeyboardShortcuts> = { logic, defaultState }
