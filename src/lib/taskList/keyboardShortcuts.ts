import { registerShortcuts } from "$lib/keyboardShortcuts/logic"
import { appLogic } from "$lib/logic"
import { activationShortcuts } from "./logic/activationLogic"

export function setupKeyboardShortcuts() {
    registerShortcuts([
        { key: "d", action: appLogic.taskDeleteRequested.action, isDisabledDuringTextInput: true },
        { key: "c", action: appLogic.startedEditingTaskTitle.action, isDisabledDuringTextInput: true },
        { key: "J", action: appLogic.taskMoveDownRequested.action, isDisabledDuringTextInput: true },
        { key: "K", action: appLogic.taskMoveUpRequested.action, isDisabledDuringTextInput: true },
        { key: " ", action: appLogic.taskStartStopRequested.action, isDisabledDuringTextInput: true },
        { key: "o", action: appLogic.taskCreateNewBelowActiveRequested.action, isDisabledDuringTextInput: true },
        { key: "O", action: appLogic.taskCreateNewAboveActiveRequested.action, isDisabledDuringTextInput: true },
        ...activationShortcuts,

        // TODO When adding a new task, the Enter at the end of editing the title is caught and the task is finished immediately
        // { key: "Enter", action: appLogic.taskFinishRequested.action, isDisabledDuringTextInput: true },
    ])
}
