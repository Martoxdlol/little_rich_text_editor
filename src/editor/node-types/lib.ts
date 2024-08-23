import { EditorContext } from '..'
import type {
    EditorCommand,
    InputCommand,
    InputCommandOutput,
} from '../commands/lib'
import { insertAfter, insertFirst, insertLast } from '../lib'

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
    allowChild?: (
        node: Node,
        pos: number,
        container: Node,
        childTypes: NodeType[],
        defaultAllowed: boolean,
    ) => boolean
    /**
     * Validate if existing child is valid
     */
    validateChild?: (
        node: Node,
        pos: number,
        container: Node,
        childTypes: NodeType[],
        defaultAllowed: boolean,
    ) => boolean
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
    execInputCommand: (
        command: InputCommand,
        context: EditorContext,
    ) => InputCommandOutput | undefined
    /**
     * Receives command generate by the editor, (for example change font color)
     */
    execEditorCommand?: (command: EditorCommand) => void
    /**
     * In most cases any node must have at least one child. But it can be personalized
     */
    minChildrenCount?: number
    /**
     * For text node, that doesn't allow having children
     */
    noChildren?: boolean
}

export type NodeType = Omit<
    CreateNodeTypeOptions,
    'allowChild' | 'validateChild'
> & {
    allowChild: (node: Node, pos: number, container: Node) => boolean
    validateChild: (node: Node, pos: number, container: Node) => boolean
    minChildrenCount: number
    noChildren: boolean
    addEmptyChildBefore: (before: Node) => Node | undefined
    addEmptyChildAfter: (after: Node) => Node | undefined
    addEmptyChildFirst: (container: Node) => Node | undefined
    addEmptyChildLast: (container: Node) => Node | undefined
}

export function createNodeType(opts: CreateNodeTypeOptions): NodeType {
    function addEmptyChildBefore(before: Node) {
        if (opts.createEmptyChild) {
            const c = opts.createEmptyChild()
            insertAfter(c, before)
            return c
        }
    }

    function addEmptyChildAfter(after: Node) {
        if (opts.createEmptyChild) {
            const c = opts.createEmptyChild()
            insertAfter(c, after)
            return c
        }
    }

    function addEmptyChildFirst(container: Node) {
        if (opts.createEmptyChild) {
            const c = opts.createEmptyChild()
            insertFirst(c, container)
            return c
        }
    }

    function addEmptyChildLast(container: Node) {
        if (opts.createEmptyChild) {
            const c = opts.createEmptyChild()
            insertLast(c, container)
            return c
        }
    }

    function allowChild(node: Node, pos: number, container: Node): boolean {
        let defaultAllowed = false

        for (const type of opts.getChildTypes()) {
            if (type.matchRoot(node)) {
                defaultAllowed = true
                break
            }
        }

        if (opts.allowChild) {
            return opts.allowChild(
                node,
                pos,
                container,
                opts.getChildTypes(),
                defaultAllowed,
            )
        }

        return defaultAllowed
    }

    function validateChild(node: Node, pos: number, container: Node): boolean {
        const defaultValid = allowChild(node, pos, container)

        if (opts.validateChild) {
            return opts.validateChild(
                node,
                pos,
                container,
                opts.getChildTypes(),
                defaultValid,
            )
        }

        return defaultValid
    }

    return {
        ...opts,
        minChildrenCount: opts.minChildrenCount ?? 1,
        noChildren: opts.noChildren === true,
        allowChild,
        validateChild,
        addEmptyChildBefore,
        addEmptyChildAfter,
        addEmptyChildFirst,
        addEmptyChildLast,
    }
}
