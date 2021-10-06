import { dispatch } from "./eventHelpers"
import { logic } from "./events"
import { state } from "./state"

let isTextInputFocused: boolean
let activeTaskIndex: number | undefined
state.subscribe(value => {
    isTextInputFocused = value.isTextInputFocused
    activeTaskIndex = value.activeTaskIndex
})

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
            }
        }
    })
}
