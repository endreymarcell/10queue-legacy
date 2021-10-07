// Use this utility to force nominal typing, ie. to create a type
// that is structurally equivalent to another one but still cannot be assigned to it
export const uniqueTypeSymbol = Symbol.for("uniqueType")

export function moveArrayElement<T>(array: ReadonlyArray<T>, fromIndex: number, toIndex: number): Array<T> {
    const result = [...array]
    const itemToAdd = result.splice(fromIndex, 1)[0]
    result.splice(toIndex, 0, itemToAdd)
    return result
}

// Don't look
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never
type Push<T extends any[], V> = [...T, V]
type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N
    ? []
    : Push<TuplifyUnion<Exclude<T, L>>, L>
export type ObjValueTuple<T, KS extends any[] = TuplifyUnion<keyof T>, R extends any[] = []> = KS extends [
    infer K,
    ...infer KT
]
    ? ObjValueTuple<T, KT, [...R, T[K & keyof T]]>
    : R
