import { FmountDOM } from './mount-handler.js'
import { FdestroyDOM } from './destroy-dom-handler.js'
import { FsetAttributes } from './attr-handler.js'
import { FaddEventlistners, FremoveEventlistneres} from './events-handler.js'

export function FpatchDOM(oldVdom, newVdom, parentEl) {
    if (!oldVdom) {
        FmountDOM(newVdom, parentEl);
        return;
    }

    if (!newVdom) {
        FdestroyDOM(oldVdom);
        return;
    }

    if (oldVdom.type !== newVdom.type) {
        const nextSibling = oldVdom.el.nextSibling;
        FdestroyDOM(oldVdom);
        FmountDOM(newVdom, parentEl);
        if (nextSibling) {
            parentEl.insertBefore(newVdom.el, nextSibling);
        }
        return;
    }

    newVdom.el = oldVdom.el;

    switch (newVdom.type) {
        case "text":
            FpatchText(oldVdom, newVdom);
            break;
        case "element":
            FpatchElement(oldVdom, newVdom);
            break;
        case "fragment":
            FpatchFragment(oldVdom, newVdom);
            break;
    }
}

function FpatchText(oldVdom, newVdom) {
    if (oldVdom.value !== newVdom.value) {
        oldVdom.el.nodeValue = newVdom.value;
    }
}

function FpatchElement(oldVdom, newVdom) {
    const el = oldVdom.el;

    FpatchAttributes(oldVdom.props, newVdom.props, el);

    if (oldVdom.listeners) {
        FremoveEventlistneres(oldVdom.listeners, el);
    }
    const { on: events} = newVdom.props;
    newVdom.listeners = FaddEventlistners(events, el);

    FpatchChildren(oldVdom.children, newVdom.children, el);
}

function FpatchFragment(oldVdom, newVdom) {
    FpatchChildren(oldVdom.children, newVdom.children, oldVdom.el);
}

function FpatchChildren(oldChildren, newChildren, parentEl) {
    const maxLength = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < maxLength; i++) {
        const oldChild = oldChildren[i];
        const newChild = newChildren[i];

        if (!oldChild && newChild) {
            FmountDOM(newChild, parentEl);
        } else if (oldChild && !newChild) {
            FdestroyDOM(oldChild);
        } else if (oldChild && newChild) {
            FpatchDOM(oldChild, newChild, parentEl);
        }
    }
}

function FpatchAttributes(oldProps, newProps, el) {
    const { on: oldEvents, ...oldAttrs } = oldProps;
    const { on: newEvents, ...newAttrs } = newProps;

    Object.keys(oldAttrs).forEach(key => {
        if (!(key in newAttrs)) {
            if (key === 'class') {
                el.className = '';
            } else if (key.startsWith('data-')) {
                el.removeAttribute(key);
            } else {
                el.removeAttribute(key);
                if (key in el) {
                    el[key] = null;
                }
            }
        }
    });

    FsetAttributes(el, newAttrs);
}