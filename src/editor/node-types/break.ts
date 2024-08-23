import { createNodeType } from "./lib"

export const breakType = createNodeType({
    getChildTypes: () => [],
    createEmpty: () => {
        return document.createElement('br')
    },
    matchRoot: (node) => node instanceof HTMLBRElement,
    execInputCommand: () => ({ allowDefault: true }),
    minChildrenCount: 0,
    noChildren: true,
})