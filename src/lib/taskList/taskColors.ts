export const colors = [
    "aquamarine",
    "bisque",
    "blueviolet",
    "cadetblue",
    "chocolate",
    "coral",
    "cornflowerblue",
    "crimson",
    "darkgoldenrod",
    "darkolivegreen",
    "darkorange",
    "darkorchid",
    "darkseagreen",
    "darkslateblue",
    "darkviolet",
    "deeppink",
    "dodgerblue",
    "firebrick",
    "goldenrod",
    "indianred",
    "indigo",
    "lightcoral",
    "lightsalmon",
    "lightseagreen",
    "lightsteelblue",
    "limegreen",
    "mediumaquamarine",
    "mediumorchid",
    "mediumseagreen",
    "mediumslateblue",
    "mediumspringgreen",
    "mediumvioletred",
    "olivedrab",
    "tomato",
]

const cache = new Map<string, string>()

export function getColorForName(name: string): string {
    if (cache.has(name)) {
        return cache.get(name)
    }

    const hashValue = name.split("").reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0)
        return a & a
    }, 0)
    const index = Math.abs(hashValue) % colors.length
    const color = colors[index]
    cache.set(name, color)

    return color
}
