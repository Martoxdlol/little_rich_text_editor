import { createInputCommand } from "./commands/lib"
import { type CaretPosition, getCaret, matchType, setCaret } from "./lib"
import { defaultTypeNodes } from "./node-types"
import type { NodeType } from "./node-types/lib"


export function startEditor(root: HTMLElement, typesNodes = defaultTypeNodes) {
    if (root.hasAttribute('editor-init')) {
        return
    }

    root.setAttribute('editor-init', '1')
    root.contentEditable = 'true'

    const rootType = matchType(root, typesNodes)

    if (!root) {
        throw new Error("Invalid root type")
    }

    if (!validateTree(root, typesNodes)) {
        root.innerHTML = ''
        rootType?.addEmptyChildFirst(root)
    }

    let lastValidHTML = root.innerHTML
    let lastCaret: CaretPosition | null = null

    root.onbeforeinput = (e) => {
        lastCaret = getCaret()
        lastValidHTML = root.innerHTML

        const command = createInputCommand(e)

        if (!command) {
            e.preventDefault()
            return
        }

        const type = matchType(command.node, typesNodes)

        if (!type) {
            throw new Error("Invalid editor state")
        }

        const output = type?.execInputCommand(command)

        if (!output?.allowDefault) {
            e.preventDefault()
        }
    }

    root.oninput = () => {
        if (validateTree(root, typesNodes)) {
            lastValidHTML = root.innerHTML
        } else {
            root.innerHTML = lastValidHTML
            if (lastCaret) {
                setCaret(lastCaret)
            }
        }
    }
}



function validateTree(node: Node, types: NodeType[]) {
    const type = matchType(node, types)

    if (!type) {
        return false
    }

    if (node.childNodes.length < type.minChildrenCount) {
        return false
    }

    if (type.noChildren) {
        return true
    }

    for (const [i, child] of node.childNodes.entries()) {
        if (!type.validateChild(child, i, node)) {
            return false
        }

        if (!validateTree(child, types)) {
            return false
        }
    }

    return true
}