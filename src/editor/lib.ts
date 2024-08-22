import type { NodeType } from "./node-types/lib"

export function insertBefore(node: Node, before: Node) {
    before.parentNode?.insertBefore(node, before)
}

export function insertAfter(node: Node, after: Node) {
    after.parentNode?.insertBefore(node, after.nextSibling)
}

export function insertFirst(node: Node, container: Node) {
    container.insertBefore(node, container.firstChild)
}

export function insertLast(node: Node, container: Node) {
    container.appendChild(node)
}

export type CaretPosition = {
    node: Node
    offset: number
}

export function getCaret(): CaretPosition | null {
    const selection = getSelection()

    if (selection?.focusNode) {
        return {
            node: selection.focusNode,
            offset: selection.focusOffset,
        }
    }

    return null
}

export function setCaret(caret: CaretPosition) {
    getSelection()?.collapse(caret.node, caret.offset)
}

export function matchType(node: Node, types: NodeType[]): NodeType | null {
    for (const type of types) {
        if (type.matchRoot(node)) {
            return type
        }
    }

    return null
}