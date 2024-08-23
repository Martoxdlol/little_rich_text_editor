import { createInputCommand } from "./commands/lib"
import { type CaretPosition, getCaret, matchType, setCaret } from "./lib"
import { defaultTypeNodes } from "./node-types"
import type { NodeType } from "./node-types/lib"


export function startEditor(root: HTMLElement, typesNodes = defaultTypeNodes) {
    // prevent reinitialize editor
    if (root.hasAttribute('editor-init')) {
        return
    }
    root.setAttribute('editor-init', '1')

    // make it editable! yey!!!
    root.contentEditable = 'true'

    const rootType = matchType(root, typesNodes)

    if (!root) {
        throw new Error("Invalid root type")
    }

    if (!validateTree(root, typesNodes)) {
        root.innerHTML = ''
        rootType?.addEmptyChildFirst(root)
    }

    // Save caret position and html for when restoring the tree
    let lastValidHTML = root.innerHTML
    let lastCaret: CaretPosition | null = null

    // When something happen, this runs first
    // It may do some changes by itself
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

    // Runs second,
    // we need to verify the tree and prevent invalid states
    root.oninput = () => {
        if (validateTree(root, typesNodes)) {
            lastValidHTML = root.innerHTML
        } else {
            console.warn("Invalid tree, restoring")
            root.innerHTML = lastValidHTML
            if (lastCaret) {
                setCaret(lastCaret)
            }
        }
    }
}



function validateTree(root: Node, types: NodeType[]) {
    const type = matchType(root, types)

    if (!type) {
        return false
    }

    if (root.childNodes.length < type.minChildrenCount) {
        return false
    }

    if (type.noChildren) {
        return root.childNodes.length === 0
    }

    for (const [i, child] of root.childNodes.entries()) {
        if (!type.validateChild(child, i, root)) {
            return false
        }

        if (!validateTree(child, types)) {
            return false
        }
    }

    return true
}