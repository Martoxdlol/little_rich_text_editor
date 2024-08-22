import { getCaret } from "../lib"

export type InputCommand = {
    node: Node
    offset: number
    inputType: InputEvent['inputType']
    data: InputEvent['data']
}

export type InputCommandOutput = {
    allowDefault?: boolean
}

export function createInputCommand(event: InputEvent): InputCommand | null {
    const caret = getCaret()

    if (!caret) {
        return null
    }

    return {
        data: event.data,
        inputType: event.inputType,
        node: caret.node,
        offset: caret.offset
    }
}

export type NodeSelectionRange = {
    start: number
    end: number
}

export type EditorCommand<T = unknown> = {
    type: string
    node: Node
    offset: number
    selection: NodeSelectionRange | null
    data: T
}