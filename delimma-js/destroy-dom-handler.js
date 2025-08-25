import { FremoveEventlistneres } from "./events-handler.js";

//to remeve vdom elements recursively
export function FdestroyDOM(vdom) {
    switch (vdom.type) {
        case "text":
            if (vdom.el && vdom.el.parentNode) {
                vdom.el.remove();
            }
            break;
        case "element":
            if (vdom.listeners) {
                FremoveEventlistneres(vdom.listeners, vdom.el);
            }
            vdom.children.forEach(FdestroyDOM);
            if (vdom.el && vdom.el.parentNode) {
                vdom.el.remove();
            }
            break;
        case "fragment":
            vdom.children.forEach(FdestroyDOM);
            break;
        default:
            throw new Error(`Can't destroy DOM of type: ${vdom.type}`);
    }
    delete vdom.el;
}