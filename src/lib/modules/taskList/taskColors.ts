export type EntryStyle = { foregroundColor: string; backgroundColor: string }
export const styles: EntryStyle[] = [
    ["Aquamarine", "CadetBlue"],
    ["BurlyWood", "Brown"],
    ["CadetBlue", "DarkSlateBlue"],
    ["Coral", "Crimson"],
    ["Orange", "DarkOrange"],
    ["DarkTurquoise", "DarkCyan"],
    ["DeepSkyBlue", "DodgerBlue"],
    ["Gold", "GoldenRod"],
    ["HotPink", "MediumVioletRed"],
    ["MediumPurple", "Purple"],
    ["Plum", "RebeccaPurple"],
    ["Salmon", "SaddleBrown"],
    ["Tomato", "FireBrick"],
].map(([foregroundColor, backgroundColor]) => ({
    foregroundColor,
    backgroundColor,
}))

const hashFunction = (acc: number, name: string) => {
    acc = (acc << 5) - acc + name.charCodeAt(0)
    return acc & acc
}

const cache = new Map<string, EntryStyle>()

export function getStyleForName(name: string): EntryStyle {
    if (cache.has(name)) {
        return cache.get(name)
    }

    const hashValue = name.split("").reduce(hashFunction, 0)
    const index = Math.abs(hashValue) % styles.length
    const style = styles[index]
    cache.set(name, style)

    return style
}
