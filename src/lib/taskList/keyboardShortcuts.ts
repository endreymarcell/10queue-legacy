import { registerShortcuts } from "$lib/keyboardShortcuts/logic"
import { appLogic } from "$lib/logic"

export function setupKeyboardShortcuts() {
    registerShortcuts([
        { key: "j", action: appLogic.taskActivateNextRequested.action, isDisabledDuringTextInput: true },
        { key: "k", action: appLogic.taskActivatePreviousRequested.action, isDisabledDuringTextInput: true },
        { key: "d", action: appLogic.taskDeleteRequested.action, isDisabledDuringTextInput: true },
        { key: "c", action: appLogic.startedEditingTaskTitle.action, isDisabledDuringTextInput: true },
        { key: "J", action: appLogic.taskMoveDownRequested.action, isDisabledDuringTextInput: true },
        { key: "K", action: appLogic.taskMoveUpRequested.action, isDisabledDuringTextInput: true },
        { key: " ", action: appLogic.taskStartStopRequested.action, isDisabledDuringTextInput: true },
        { key: "o", action: appLogic.taskCreateNewBelowActiveRequested.action, isDisabledDuringTextInput: true },
        { key: "O", action: appLogic.taskCreateNewAboveActiveRequested.action, isDisabledDuringTextInput: true },
    ])
}
