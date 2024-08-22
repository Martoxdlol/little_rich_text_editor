import { createNodeType } from "./lib"

export const paragraphType = createNodeType({
    getChildTypes: () => [],
    createEmpty: () => {
        const p = document.createElement('p')
        p.innerHTML = '<br>'
        return p
    },
    matchRoot: (node) => node instanceof HTMLParagraphElement,
    createEmptyChild: () => new Text(),
    execInputCommand: () => ({ allowDefault: true }),
})