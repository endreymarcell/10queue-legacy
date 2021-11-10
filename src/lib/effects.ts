import { createEffect, schedule } from "$lib/logical/logicHelpers"
import { setupKeyboardShortcutListener } from "$lib/modules/keyboardShortcuts/logic"
import { setupKeyboardShortcuts as setupUndoKeyboardShortcuts } from "$lib/modules/undo/keyboardShortcuts"
import { setupKeyboardShortcuts as setupHelpModalKeyboardShortcuts } from "$lib/modules/help/keyboardShortcuts"
import { setupKeyboardShortcuts as setupPersistenceKeyboardShortcuts } from "$lib/modules/persistence/keyboardShortcuts"
import { logger } from "$lib/helpers/logger"
import { persistence } from "./modules/persistence/logic"

export const effects = {
    setupListenersAndStuff: () =>
        createEffect(() => {
            setupKeyboardShortcutListener()
            setupUndoKeyboardShortcuts()
            setupHelpModalKeyboardShortcuts()
            setupPersistenceKeyboardShortcuts()
            schedule(persistence.effects.setupAutoSave())
            logger.autoSetLevel()
        }),
    changePageTitle: (newTitle: string) => createEffect(newTitle => (document.title = newTitle), [newTitle]),
}
