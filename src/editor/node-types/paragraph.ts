import { createNodeType } from "./lib"
import { textType } from "./text"

export const paragraphType = createNodeType({
    getChildTypes: () => [textType],
    createEmpty: () => {
        const p = document.createElement('p')
        p.innerHTML = '<br>'
        return p
    },
    validateChild: (node, pos, container) => {
        return node instanceof HTMLBRElement && pos === 0 && container.childNodes.length === 1
    },
    matchRoot: (node) => node instanceof HTMLParagraphElement,
    createEmptyChild: () => new Text(),
    execInputCommand: () => ({ allowDefault: true }),
})