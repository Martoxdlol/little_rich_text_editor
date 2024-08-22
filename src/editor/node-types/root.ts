import { createNodeType } from "./lib";
import { paragraphType } from "./paragraph";

export const rootType = createNodeType({
    getChildTypes: () => [paragraphType],
    createEmpty: () => document.createElement('div'),
    matchRoot: (node) => node instanceof HTMLDivElement,
    createEmptyChild: () => paragraphType.createEmpty(),
    execInputCommand: () => ({ allowDefault: true }),
})