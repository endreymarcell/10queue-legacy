// Use this utility to force nominal typing, ie. to create a type
// that is structurally equivalent to another one but still cannot be assigned to it
export const uniqueTypeSymbol = Symbol.for("uniqueType")

export function moveArrayElement<T>(array: ReadonlyArray<T>, fromIndex: number, toIndex: number): Array<T> {
    const result = [...array]
    const itemToAdd = result.splice(fromIndex, 1)[0]
    result.splice(toIndex, 0, itemToAdd)
    return result
}
