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

export function pick<Obj extends Record<string, unknown>, Keys extends readonly (keyof Obj)[]>(obj: Obj, keys: Keys) {
    const newObject = Object.fromEntries(keys.map(key => [[key], obj[key]]))
    return newObject as Pick<Obj, Keys[number]>
}

export function formatTimeForHumans(seconds: number): string {
    const minutes = (seconds - (seconds % 60)) / 60
    const hours = (minutes - (minutes % 60)) / 60
    const onlyMinutes = minutes - hours * 60
    const onlySeconds = seconds - minutes * 60
    const paddedMinutes = hours > 0 && onlyMinutes < 10 ? `0${onlyMinutes}` : onlyMinutes
    const paddedSeconds = minutes > 0 && onlySeconds < 10 ? `0${onlySeconds}` : onlySeconds
    const hoursString = hours > 0 ? `${hours}:` : ""
    const minutesString = minutes > 0 ? `${paddedMinutes}:` : ""
    const secondsString = seconds > 0 ? `${paddedSeconds}` : ""
    return hoursString + minutesString + secondsString
}
