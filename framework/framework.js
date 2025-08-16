let root = document.body;

export function setRoot(id) {
  if (id === null) {
    return;
  }
  if (typeof id !== 'string' &&  typeof id !== 'number') {
    throw new Error(`there is no element with the id :${id}`);
  }
  let element = document.getElementById(`${id}`);
  if (element === null) {
    throw new Error(`there is no element with the id :${id}`);
  }
  root = element;
}

export function setElement(tag , attrs, ...chidlren){
    if (typeof tag === "function") {
        return { ...attrs||{},chidlren }
    }
    return {tag, ...attrs || {} , chidlren}
}

export function CreateElement(type, attr = {}, ...chidlren) {
  const element = document.createElement(type);
  const keys = Object.keys(attr);
  for (let i = 0; i < keys.length; i++) {
    const loopattr = keys[i];
    const value = attr[loopattr];
    if (loopattr.startsWith("on") && typeof value === "function") {
      // Event listener (e.g., onClick)
      element.addEventListener(loopattr.substring(2).toLowerCase(), value);
    } else {
      element.setAttribute(loopattr, value);
    }
  }

  for (let i = 0; i < chidlren.length; i++) {
    const child = chidlren[i];
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  }
  return element;
}
