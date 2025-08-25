//adds event listeners to an element
export function FaddEventlistners(listeners = {}, el) {
    const addedListeners = {};
    Object.entries(listeners).forEach(([eventName, handler]) => {
        const property = 'on' + eventName;
        el[property] = handler;
        addedListeners[eventName] = handler;
    });
    return addedListeners;
}

//remove the event listeners of an element
export function FremoveEventlistneres(listeners = {}, el) {
    Object.keys(listeners).forEach(eventName => {
        const property = 'on' + eventName;
        el[property] = null;
    });
}