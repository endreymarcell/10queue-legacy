import type { EventListType, Logic } from "$lib/helpers/logicHelpers"

export type ModuleType = {
    Events: EventListType
    State?: unknown
}

export type Module<T extends ModuleType> = {
    logic: Logic<T["Events"]>
    defaultState?: T["State"]
}
