import { createEffect } from "$lib/logicHelpers"

export const effects = {
    changePageTitle: (newTitle: string) => createEffect(newTitle => (document.title = newTitle), [newTitle]),
}
