import { matchType, setCaret } from '../lib'
import { breakType } from './break'
import { createNodeType } from './lib'
import { unorderedListType } from './list'
import { unorderedListItemType } from './list-item'
import { textType } from './text'

export const paragraphType = createNodeType({
    getChildTypes: () => [textType, breakType],
    createEmpty: () => {
        const p = document.createElement('p')
        p.innerHTML = '<br>'
        return p
    },
    validateChild: (node, pos, container, _, validateDefault) => {
        if (validateDefault) {
            return true
        }

        // edge case: empty p has a <br> inside
        return (
            node instanceof HTMLBRElement &&
            pos === 0 &&
            container.childNodes.length === 1
        )
    },
    matchRoot: (node) => node instanceof HTMLParagraphElement,
    createEmptyChild: () => new Text(),
    execInputCommand: (command, ctx) => {
        if (
            command.inputType === 'insertParagraph' &&
            unorderedListItemType.matchRoot(command.node.parentNode!)
        ) {
            let container = command.node.parentNode?.parentNode
            let target: Node | null | undefined = command.node.parentNode

            // If parent is a list, we don't want to create a new list item,
            // we want to create a item outside the list, so we set out target and container outside the ul
            if (container && unorderedListType.matchRoot(container)) {
                container = container.parentNode
                target = target?.parentNode
            }

            if (container && target) {
                const type = matchType(container, ctx.nodeTypes)
                const c = type?.addEmptyChildAfter(target)
                if (c) {
                    setCaret({ node: c, offset: 0 })
                }
            }

            if (
                command.node.parentNode!.childNodes.length === 1 &&
                command.node.textContent?.trim() === ''
            ) {
                ;(command.node.parentNode as HTMLElement).remove()
            }

            return { allowDefault: false }
        }

        return { allowDefault: true }
    },
})
