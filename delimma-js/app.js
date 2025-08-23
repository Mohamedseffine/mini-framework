import { FdestroyDOM } from "./destroy-dom-handler.js";
import { FmountDOM } from "./mount-handler.js";
import { FpatchDOM } from "./diffing-algo.js";

export function FcreateApp({ state, view, reducers = {} }) {
    let parentEl = null;
    let vdom = null;
    let isRendering = false;
    const eventHandlers = new Map();
    const afterRenderHandlers = [];

    function Femit(eventName, payload) {
        try {
            if (eventHandlers.has(eventName)) {
                eventHandlers.get(eventName).forEach((handler) => {
                    handler(payload);
                });
            }

            afterRenderHandlers.forEach((handler) => {
                handler(eventName, payload);
            });
        } catch (error) {
            console.error(`Error sending event${eventName}:`, error);
        }
    }

    for (const actionName in reducers) {
        const reducer = reducers[actionName];

        if (!eventHandlers.has(actionName)) {
            eventHandlers.set(actionName, []);
        }
        eventHandlers.get(actionName).push((payload) => {
            state = reducer(state, payload);
        });
    }
    afterRenderHandlers.push(() => {
        FrenderApp();
    });

    function FhandlePopState() {
        const path = window.location.hash.slice(1) || "/";
        Femit("routeChange", path);
    }
    window.addEventListener("popstate", FhandlePopState);
    function navigate(path) {
        window.location.hash = path === "/" ? "" : path;
    }

    function FrenderApp() {
        if (isRendering) return;
        isRendering = true;

        const activeElement = document.activeElement;
        const isInput =
            activeElement &&
            (activeElement.tagName === "INPUT" ||
                activeElement.tagName === "TEXTAREA");
        const isEditingInput = isInput && activeElement.classList.contains("edit");
        const isToggleInput = isInput && activeElement.classList.contains("toggle");
        const cursorPos = isInput ? activeElement.selectionStart : null;
        const cursorEnd = isInput ? activeElement.selectionEnd : null;
        const elementClass = isInput ? activeElement.className : null;
        const elementId =
            isInput && activeElement.dataset ? activeElement.dataset.todoId : null;

        const newVdom = view(state, Femit, navigate);
        if (vdom) {
            FpatchDOM(vdom, newVdom, parentEl);
        } else {
            FmountDOM(newVdom, parentEl);
        }
        vdom = newVdom;
        if (isInput && elementClass) {
            let targetInput = null;

            if (isEditingInput && elementId) {
                targetInput = parentEl.querySelector(
                    `input.edit[data-todo-id="${elementId}"]`
                );
            } else if (isToggleInput && elementId) {
                targetInput = parentEl.querySelector(
                    `input.toggle[data-todo-id="${elementId}"]`
                );
            } else if (!isEditingInput && !isToggleInput) {
                targetInput = parentEl.querySelector(
                    `input.${elementClass.replace(/\s+/g, ".")}`
                );
            }

            if (targetInput) {
                targetInput.focus();
                if (cursorPos !== null && cursorEnd !== null) {
                    targetInput.setSelectionRange(cursorPos, cursorEnd);
                }
            }
        }

        if (state.editingId && !isEditingInput) {
            setTimeout(() => {
                const editInput = parentEl.querySelector(
                    `input.edit[data-todo-id="${state.editingId}"]`
                );
                if (editInput) {
                    editInput.focus();
                    editInput.select();
                }
            }, 0);
        }

        isRendering = false;
    }

    return {
        Femit,
        Fmount(_parentEl) {
            parentEl = _parentEl;
            FrenderApp();
        },
        Funmount() {
            window.removeEventListener("popstate", FhandlePopState);
            if (vdom) FdestroyDOM(vdom);
            vdom = null;
            eventHandlers.clear();
            afterRenderHandlers.length = 0;
        },
    };
}