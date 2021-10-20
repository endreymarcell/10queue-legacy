import { registerShortcuts } from "$lib/modules/keyboardShortcuts/logic"
import { appLogic } from "$lib/logic"

export function setupKeyboardShortcuts() {
    registerShortcuts([
        { key: "u", action: appLogic.undo.action, isDisabledDuringTextInput: true },
        { key: "U", action: appLogic.redo.action, isDisabledDuringTextInput: true },
    ])
}
