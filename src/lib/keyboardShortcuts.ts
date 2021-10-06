import { dispatch } from "./eventHelpers"
import { logic } from "./events"
import { state } from "./state"

let isTextInputFocused: boolean
let activeTaskIndex: number | undefined
state.subscribe(value => {
    isTextInputFocused = value.isTextInputFocused
    activeTaskIndex = value.activeTaskIndex
})

// TODO do this more elegantly
export function setupKeyboardShortcuts() {
    document.addEventListener("keydown", event => {
        if (!isTextInputFocused) {
            switch (event.key) {
                case " ": {
                    event.preventDefault()
                    dispatch(logic.taskStartStopRequested.action())
                    break
                }
                case "d": {
                    event.preventDefault()
                    dispatch(logic.taskDeleteRequested.action(activeTaskIndex))
                    break
                }
                case "j": {
                    event.preventDefault()
                    dispatch(logic.taskActivateNextRequested.action())
                    break
                }
                case "k": {
                    event.preventDefault()
                    dispatch(logic.taskActivatePreviousRequested.action())
                    break
                }
                case "J": {
                    event.preventDefault()
                    dispatch(logic.taskMoveDownRequested.action(activeTaskIndex))
                    break
                }
                case "K": {
                    event.preventDefault()
                    dispatch(logic.taskMoveUpRequested.action(activeTaskIndex))
                    break
                }
                case "u": {
                    event.preventDefault()
                    dispatch(logic.restoreUndoPoint.action())
                    break
                }
            }
        }
    })
}
