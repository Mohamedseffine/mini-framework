import { FsetAttributes } from "./attr-handler.js";
import { FaddEventlistners } from "./events-handler.js"
//this function converts virtual DOM objects into real DOM elements and
//adding them to the prentElement for the first time.
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

//creating a textNode when the child is a text and insert it in the parent 
function FcreateTextNode(vdom, parentEl) {
    const textNode = document.createTextNode(vdom.value);
    vdom.el = textNode;
    parentEl.appendChild(textNode);
}
//creates an html fragement to wrap elements tha have no parent and insert it in the parent
function FcreateFragmentNodes(vdom, parentEl) {
    vdom.el = parentEl;
    vdom.children.forEach(child => FmountDOM(child, parentEl));
}

//creates an html element from the vdom and iserts it in the parent recursivly
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