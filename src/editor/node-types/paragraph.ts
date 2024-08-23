import { insertBefore, matchType, setCaret } from '../lib'
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
            let container = command.node.parentNode?.parentNode?.parentNode
            let target: Node | null | undefined =
                command.node.parentNode?.parentNode

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
            } else if (command.node.lastChild instanceof HTMLBRElement) {
                ;(command.node.lastChild as HTMLBRElement).remove()
            }

            return { allowDefault: false }
        }

        // Delete first li
        if (
            command.inputType === 'deleteContentBackward' &&
            unorderedListItemType.matchRoot(command.node.parentNode!)
            // @ts-ignore
            // Typescript error
        ) {
            const li = command.node.parentNode
            const ul = li?.parentNode

            // @ts-ignore
            if (li && ul && ul.childNodes[0] === li) {
                ;(command.node as HTMLParagraphElement).remove()
                insertBefore(command.node, ul)
                if (!ul.hasChildNodes()) {
                    ;(ul as HTMLElement).remove()
                }
                return { allowDefault: false }
            }
        }

        return { allowDefault: true }
    },
})
