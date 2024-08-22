import type { EditorCommand, InputCommand, InputCommandOutput } from "../commands/lib"
import { insertAfter, insertFirst, insertLast } from "../lib"

export type CreateNodeTypeOptions = {
    /**
     * Match node type. Example: `node instanceof HTMLParagraphElement`
     */
    matchRoot: (node: Node) => boolean
    /**
     * Valid types that can be children of this root
     */
    getChildTypes: () => NodeType[]
    /**
     * In some cases some nodes may not be placeable in some position even if it is a valid childType
     */
    allowChild?: (node: Node, pos: number, childTypes: NodeType[], defaultAllowed: boolean) => boolean
    /**
     * Create empty element of the type
     */
    createEmpty: () => Node
    /**
     * Create a child element. Example: a new `li` in a list
     */
    createEmptyChild?: () => Node
    /**
     * Receives a command from a input event to actually do changes to content
     */
    execInputCommand: (command: InputCommand) => InputCommandOutput | undefined
    /**
     * Receives command generate by the editor, (for example change font color)
     */
    execEditorCommand?: (command: EditorCommand) => void
}

export type NodeType = Omit<CreateNodeTypeOptions, 'getChildTypes' | 'allowChild'> & {
    childTypes: NodeType[]
    allowChild: (node: Node, pos: number) => boolean
    addEmptyChildBefore: (node: Node) => void
    addEmptyChildAfter: (before: Node) => void
    addEmptyChildFirst: (container: Node) => void
    addEmptyChildLast: (container: Node) => void
}

export function createNodeType(opts: CreateNodeTypeOptions): NodeType {
    const childTypes = opts.getChildTypes()

    function addEmptyChildBefore(before: Node) {
        if (opts.createEmptyChild) {
            insertAfter(opts.createEmptyChild(), before)
        }
    }

    function addEmptyChildAfter(after: Node) {
        if (opts.createEmptyChild) {
            insertAfter(opts.createEmptyChild(), after)
        }
    }

    function addEmptyChildFirst(container: Node) {
        if (opts.createEmptyChild) {
            insertFirst(opts.createEmptyChild(), container)
        }
    }

    function addEmptyChildLast(container: Node) {
        if (opts.createEmptyChild) {
            insertLast(opts.createEmptyChild(), container)
        }
    }

    function allowChild(node: Node, pos: number): boolean {
        let defaultAllowed = false

        for (const type of childTypes) {
            if (type.matchRoot(node)) {
                defaultAllowed = true
                break
            }
        }

        if (opts.allowChild) {
            return opts.allowChild(node, pos, childTypes, defaultAllowed)
        }

        return false
    }

    return {
        ...opts,
        childTypes,
        allowChild,
        addEmptyChildBefore,
        addEmptyChildAfter,
        addEmptyChildFirst,
        addEmptyChildLast,
    }
}

