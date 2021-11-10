import { createEffect } from "$lib/helpers/logicHelpers"
import { setupKeyboardShortcutListener } from "$lib/modules/keyboardShortcuts/logic"
import { setupKeyboardShortcuts as setupUndoKeyboardShortcuts } from "$lib/modules/undo/keyboardShortcuts"
import { setupKeyboardShortcuts as setupHelpModalKeyboardShortcuts } from "$lib/modules/help/keyboardShortcuts"
import { setupKeyboardShortcuts as setupPersistenceKeyboardShortcuts } from "$lib/modules/persistence/keyboardShortcuts"
import { setupAutoSave } from "$lib/modules/persistence/logic"
import { logger } from "$lib/helpers/logger"

export const effects = {
    setupListenersAndStuff: () =>
        createEffect(() => {
            setupKeyboardShortcutListener()
            setupUndoKeyboardShortcuts()
            setupHelpModalKeyboardShortcuts()
            setupPersistenceKeyboardShortcuts()
            setupAutoSave()
            logger.autoSetLevel()
        }),
    changePageTitle: (newTitle: string) => createEffect(newTitle => (document.title = newTitle), [newTitle]),
}
