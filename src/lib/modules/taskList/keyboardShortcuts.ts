import { registerShortcuts } from "$lib/modules/keyboardShortcuts/logic"
import { appLogic } from "$lib/logic"
import { activation } from "./logic/activationLogic"
import { moving } from "$lib/modules/taskList/logic/movingLogic"
import { creation } from "$lib/modules/taskList/logic/creationLogic"

export function setupKeyboardShortcuts() {
    registerShortcuts([
        { key: "d", action: appLogic.taskDeleteRequested.action, isDisabledDuringTextInput: true },
        { key: "c", action: appLogic.startedEditingTaskTitle.action, isDisabledDuringTextInput: true },
        { key: " ", action: appLogic.taskStartStopRequested.action, isDisabledDuringTextInput: true },
        ...creation.shortcuts,
        ...activation.shortcuts,
        ...moving.shortcuts,

        { key: "Enter", action: appLogic.taskFinishRequested.action, isDisabledDuringTextInput: true },
        { key: "s", action: appLogic.saveRequested.action, isDisabledDuringTextInput: true },
    ])
}
