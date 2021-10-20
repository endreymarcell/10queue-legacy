export function onClickOutside(node: HTMLElement) {
    const handler = event => {
        if (!node.contains(event.target)) {
            node.dispatchEvent(new CustomEvent("clickedOutside"))
        }
    }
    document.addEventListener("click", handler)
    return {
        destroy: () => document.removeEventListener("click", handler),
    }
}
