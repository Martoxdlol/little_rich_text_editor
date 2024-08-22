import { createNodeType } from "./lib"
import { unorderedListItemType } from "./list-item"

export const unorderedListType = createNodeType({
    getChildTypes: () => [unorderedListItemType],
    createEmpty: () => {
        const ul = document.createElement('ul')
        ul.appendChild(unorderedListItemType.createEmpty())
        return ul
    },
    matchRoot: (node) => node instanceof HTMLUListElement,
    createEmptyChild: () => new Text(),
    execInputCommand: () => ({ allowDefault: true }),
})
