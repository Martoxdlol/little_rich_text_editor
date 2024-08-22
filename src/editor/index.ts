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

    for (const [i, child] of node.childNodes.entries()) {
        if (!type.allowChild(child, i)) {
            return false
        }

        if (!validateTree(child, types)) {
            return false
        }
    }

    return true
}