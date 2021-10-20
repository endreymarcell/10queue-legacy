import { registerShortcuts } from "$lib/modules/keyboardShortcuts/logic"
import { appLogic } from "$lib/logic"

export function setupKeyboardShortcuts() {
    registerShortcuts([
        { key: "?", action: appLogic.openHelpModalRequested.action, isDisabledDuringTextInput: true },
        { key: "Escape", action: appLogic.closeHelpModalRequested.action, isDisabledDuringTextInput: true },
    ])
}
