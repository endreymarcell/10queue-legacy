// Use this utility to force nominal typing, ie. to create a type
// that is structurally equivalent to another one but still cannot be assigned to it
export const uniqueTypeSymbol = Symbol.for("uniqueType")
