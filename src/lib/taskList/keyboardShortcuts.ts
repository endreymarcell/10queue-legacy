import { registerShortcuts } from "$lib/keyboardShortcuts/logic"
import { appLogic } from "$lib/logic"

export function setupKeyboardShortcuts() {
    registerShortcuts([
        { key: "j", action: appLogic.taskActivateNextRequested.action, isDisabledDuringTextInput: true },
        { key: "k", action: appLogic.taskActivatePreviousRequested.action, isDisabledDuringTextInput: true },
        { key: "d", action: appLogic.taskDeleteRequested.action, isDisabledDuringTextInput: true },
    ])
}
