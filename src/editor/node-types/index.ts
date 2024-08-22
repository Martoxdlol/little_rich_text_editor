import { createNodeType, NodeType } from "./lib";

export class Types {
    get paragraphType(): NodeType {
        return createNodeType({
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
    }


    get unorderedListType(): NodeType {
        return createNodeType({
            getChildTypes: () => [this.unorderedListItemType],
            createEmpty: () => {
                const ul = document.createElement('ul')
                ul.appendChild(this.unorderedListItemType.createEmpty())
                return ul
            },
            matchRoot: (node) => node instanceof HTMLUListElement,
            createEmptyChild: () => new Text(),
            execInputCommand: () => ({ allowDefault: true }),
        })
    }

    get unorderedListItemType(): NodeType {
        return createNodeType({
            getChildTypes: () => [this.paragraphType, this.unorderedListType],
            createEmpty: () => {
                const li = document.createElement('li')
                li.appendChild(this.paragraphType.createEmpty())
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
    }
    get rootType() {
        return createNodeType({
            getChildTypes: () => [this.paragraphType],
            createEmpty: () => document.createElement('div'),
            matchRoot: (node) => node instanceof HTMLDivElement,
            createEmptyChild: () => this.paragraphType.createEmpty(),
            execInputCommand: () => ({ allowDefault: true }),
        })
    }

    static instance = new Types()
}


export const paragraphType = Types.instance.paragraphType
export const unorderedListType = Types.instance.unorderedListType
export const unorderedListItemType = Types.instance.unorderedListItemType
export const rootType = Types.instance.rootType

export const defaultTypeNodes = [
    rootType,
    paragraphType,
    unorderedListType,
    unorderedListItemType,
]
