import { registerShortcuts } from "$lib/modules/keyboardShortcuts/logic"
import { appLogic } from "$lib/logic"
import { activation } from "./logic/activationLogic"
import { moving } from "$lib/modules/taskList/logic/movingLogic"

export function setupKeyboardShortcuts() {
    registerShortcuts([
        { key: "d", action: appLogic.taskDeleteRequested.action, isDisabledDuringTextInput: true },
        { key: "c", action: appLogic.startedEditingTaskTitle.action, isDisabledDuringTextInput: true },
        { key: " ", action: appLogic.taskStartStopRequested.action, isDisabledDuringTextInput: true },
        { key: "o", action: appLogic.taskCreateNewBelowActiveRequested.action, isDisabledDuringTextInput: true },
        { key: "O", action: appLogic.taskCreateNewAboveActiveRequested.action, isDisabledDuringTextInput: true },
        ...activation.shortcuts,
        ...moving.shortcuts,

        // TODO When adding a new task, the Enter at the end of editing the title is caught and the task is finished immediately
        // { key: "Enter", action: appLogic.taskFinishRequested.action, isDisabledDuringTextInput: true },
    ])
}
