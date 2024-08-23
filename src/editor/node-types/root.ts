import { createNodeType } from "./lib";
import { unorderedListType } from "./list";
import { paragraphType } from "./paragraph";

export const rootType = createNodeType({
    getChildTypes: () => [paragraphType, unorderedListType],
    createEmpty: () => document.createElement('div'),
    matchRoot: (node) => node instanceof HTMLDivElement,
    createEmptyChild: () => paragraphType.createEmpty(),
    execInputCommand: () => ({ allowDefault: true }),
})