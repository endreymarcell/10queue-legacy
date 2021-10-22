import { registerShortcuts } from "../keyboardShortcuts/logic"
import { appLogic } from "$lib/logic"

export function setupKeyboardShortcuts() {
    registerShortcuts([{ key: "s", action: appLogic.saveRequested.action, isDisabledDuringTextInput: true }])
}
