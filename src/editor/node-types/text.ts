import { createNodeType } from "./lib"

export const textType = createNodeType({
    getChildTypes: () => [],
    createEmpty: () => {
        return new Text()
    },
    matchRoot: (node) => node instanceof Text,
    execInputCommand: () => ({ allowDefault: true }),
    minChildrenCount: 0,
    noChildren: true,
})