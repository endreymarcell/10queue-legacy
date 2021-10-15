import { createEffect } from "$lib/logicHelpers"

export const effects = {
    changePageTitle: (newTitle: string) =>
        createEffect(
            newTitle =>
                new Promise<void>(resolve => {
                    document.title = newTitle
                    resolve()
                }),
            [newTitle],
        ),
}
