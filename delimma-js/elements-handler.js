
//creating an object for each element to insert in virtual dom
export function FcreateElement(tag, props = {}, children = []) {
    return {
        tag,
        props,
        type: "element",
        children: mapTextNodes(withoutNulls(children)),
    }
}

//creating an object for each textelement to insert in virtual dom
export function FcreateElementText(str) {
    return {
        type: "text",
        value: str
    }
}


//creating an object for each fragment to insert in virtual dom
export function FcreateElementFragment(vNodes) {
    return {
        type: "fragment",
        children: mapTextNodes(withoutNulls(vNodes)),
    }
}

function mapTextNodes(children) {
    return children.map((child) => {
        if (typeof child === 'string') {
            return FcreateElementText(child)
        } else {
            return child
        }
    })
}

function withoutNulls(arr) {
    return arr.filter((item) => item != null)
}