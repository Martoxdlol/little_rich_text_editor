import { createNodeType } from "./lib"
import { unorderedListType } from "./list"
import { paragraphType } from "./paragraph"

export const unorderedListItemType = createNodeType({
    getChildTypes: () => [paragraphType, unorderedListType],
    createEmpty: () => {
        const li = document.createElement('li')
        li.appendChild(paragraphType.createEmpty())
        return li
    },
    matchRoot: (node) => node instanceof HTMLLIElement,
    createEmptyChild: () => new Text(),
    allowChild: (node, pos, _, allowed) => {
        if (pos !== 0) {
            return allowed
        }

        if (node instanceof HTMLParagraphElement) {
            return true
        }

        return false
    },
    execInputCommand: () => ({ allowDefault: true }),
})