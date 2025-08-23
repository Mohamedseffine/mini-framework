import { FsetAttributes } from "./attr-handler";
import { FaddEventlistners } from "./events-handler"

export function FmountDOM(vdom, parentEl) {
    switch (vdom.type) {
        case "text":
            FcreateTextNode(vdom, parentEl);
            break;
        case "element":
            FcreateElementNode(vdom, parentEl);
            break;
        case "fragment":
            FcreateFragmentNodes(vdom, parentEl);
            break;
        default:
            throw new Error(`Can't mount DOM of type: ${vdom.type}`);
    }
}

function FcreateTextNode(vdom, parentEl) {
    const textNode = document.createTextNode(vdom.value);
    vdom.el = textNode;
    parentEl.appendChild(textNode);
}

function FcreateFragmentNodes(vdom, parentEl) {
    vdom.el = parentEl;
    vdom.children.forEach(child => FmountDOM(child, parentEl));
}

function FcreateElementNode(vdom, parentEl) {
    const { tag, props, children } = vdom;
    const element = document.createElement(tag);

    const { on: events, ...attrs } = props;
    vdom.listeners = FaddEventlistners(events, element);
    FsetAttributes(element, attrs);

    vdom.el = element;
    children.forEach(child => FmountDOM(child, element));
    parentEl.appendChild(element);
}