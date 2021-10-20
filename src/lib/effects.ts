import { createEffect } from "$lib/helpers/logicHelpers"

export const effects = {
    changePageTitle: (newTitle: string) => createEffect(newTitle => (document.title = newTitle), [newTitle]),
}
