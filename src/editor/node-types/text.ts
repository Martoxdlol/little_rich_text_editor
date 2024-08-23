import { insertAfter } from '../lib'
import { breakType } from './break'
import { createNodeType } from './lib'
import { unorderedListType } from './list'
import { paragraphType } from './paragraph'
import { rootType } from './root'

export const textType = createNodeType({
    getChildTypes: () => [breakType],
    createEmpty: () => {
        return new Text()
    },
    matchRoot: (node) => node instanceof Text,
    execInputCommand: (command) => {
        if (
            command.node.parentNode &&
            paragraphType.matchRoot(command.node.parentNode) &&
            rootType.matchRoot(command.node.parentNode.parentNode!) &&
            command.node.parentNode.childNodes[0] === command.node &&
            command.data?.startsWith(' ') &&
            command.node.textContent?.trimStart() === '-' &&
            (command.offset === 1 || command.offset === 2)
        ) {
            const ul = unorderedListType.createEmpty()
            insertAfter(ul, command.node.parentNode)
            ;(command.node.parentNode as HTMLElement).remove()
            return { allowDefault: false }
        }

        return { allowDefault: true }
    },
    minChildrenCount: 0,
    noChildren: true,
})
