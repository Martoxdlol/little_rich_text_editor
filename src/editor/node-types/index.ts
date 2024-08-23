import { breakType } from "./break";
import { unorderedListType } from "./list";
import { unorderedListItemType } from "./list-item";
import { paragraphType } from "./paragraph";
import { rootType } from "./root";
import { textType } from "./text";

export const defaultTypeNodes = [
    rootType,
    textType,
    breakType,
    paragraphType,
    unorderedListType,
    unorderedListItemType,
]

