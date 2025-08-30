import { FdestroyDOM } from "./destroy-dom-handler.js";
import { FmountDOM } from "./mount-handler.js";
import { FpatchDOM } from "./diffing-algo.js";

export function FcreateApp({ state, view, reducers = {} }) {
    let parentEl = null;
    let vdom = null;
    //to prevent limitless recursive calls
    let isRendering = false;
    const eventHandlers = new Map();
    // Array of functions to run after each change in the states will be used to trigger Re-rendering
    const afterRenderHandlers = [];

    //applicate the changes of the states (only the global states will be handled app-centric state management)
    function Femit(eventName, payload) {
        try {
            if (eventHandlers.has(eventName)) {
                eventHandlers.get(eventName).forEach((handler) => {
                    handler(payload);
                });
            }
            //Re-renders the ui after every change in the states
            afterRenderHandlers.forEach((handler) => {
                handler();
            });
        } catch (error) {
            console.error(`Error sending event${eventName}:`, error);
        }
    }
    //add the app state handlers/reducers to the event handlers map
    for (const actionName in reducers) {
        const reducer = reducers[actionName];

        if (!eventHandlers.has(actionName)) {
            eventHandlers.set(actionName, []);
        }
        eventHandlers.get(actionName).push((payload) => {
            state = reducer(state, payload);
        });
    }
    // to trigger the Re-rendering after every change in the state
    afterRenderHandlers.push(() => {
        FrenderApp();
    });

    //to handle the change in the window history 
    function FhandlePopState() {
        const path = window.location.hash.slice(1) || "/";
        Femit("routeChange", path);
    }
    window.addEventListener("popstate", FhandlePopState);
    function navigate(path) {
        window.location.hash = path === "/" ? "" : path;
    }

    // renders the app and calls the functions that handles the diffing logic
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
        
        //extract the new virtual dom from the view function
        const newVdom = view(state, Femit, navigate);
        if (vdom) {
            FpatchDOM(vdom, newVdom, parentEl);
        } else {
            FmountDOM(newVdom, parentEl);
        }
        //constantly updating the vdom when rendering
        vdom = newVdom;

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
        //to applicate rerendering
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