import { dispatch } from "./eventHelpers"
import { appLogic } from "./logic"
import { appState } from "./state"

let isTextInputFocused: boolean
appState.subscribe(value => {
    isTextInputFocused = value.isTextInputFocused
})

// TODO do this more elegantly
export function setupKeyboardShortcuts() {
    document.addEventListener("keydown", event => {
        if (!isTextInputFocused) {
            switch (event.key) {
                case " ": {
                    event.preventDefault()
                    dispatch(appLogic.taskStartStopRequested.action())
                    break
                }
                case "d": {
                    event.preventDefault()
                    dispatch(appLogic.taskDeleteRequested.action())
                    break
                }
                case "j": {
                    event.preventDefault()
                    dispatch(appLogic.taskActivateNextRequested.action())
                    break
                }
                case "k": {
                    event.preventDefault()
                    dispatch(appLogic.taskActivatePreviousRequested.action())
                    break
                }
                case "J": {
                    event.preventDefault()
                    dispatch(appLogic.taskMoveDownRequested.action())
                    break
                }
                case "K": {
                    event.preventDefault()
                    dispatch(appLogic.taskMoveUpRequested.action())
                    break
                }
                case "u": {
                    event.preventDefault()
                    dispatch(appLogic.restoreUndoPoint.action())
                    break
                }
            }
        }
    })
}
