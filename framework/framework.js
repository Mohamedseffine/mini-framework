
export function CreateElement(type , attr = {} , ...chidlren) {
        const element = document.createElement(type)
        const keys = Object.keys(attr)
        for (let i = 0 ; i < keys.length ; i ++){
            const loopattr = keys[i]
            const value = attr[loopattr]
            // if (loopattr.startsWith('on') && typeof value === "function"){
            //      till we add events
            // }
            element.setAttribute(loopattr , value)
        }
        for (let i = 0 ; i < chidlren.length ; i ++){
            const child = chidlren[i]
            if (typeof child === "string"){
                element.appendChild(document.createTextNode(child))
            }else{
                element.appendChild(child)
            }
        }
    return element
}