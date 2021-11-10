import type { EventListType, Logic } from "$lib/logical/logicHelpers"
import type { Shortcut } from "$lib/modules/keyboardShortcuts/logic"

export type ModuleType = {
    Events: EventListType
    State?: unknown
    Shortcuts?: Shortcut[]
}

export type Module<T extends ModuleType> = {
    logic: Logic<T["Events"]>
    defaultState?: T["State"]
    shortcuts?: Shortcuts
}
