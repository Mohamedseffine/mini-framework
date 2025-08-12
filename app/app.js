import {CreateElement} from "../framework/framework.js"

window.onload=oupssie
function oupssie (){
const button = CreateElement(
    'div',
    { id: 'myBtn' , "onclick":"console.log('a')"},
);
const test = document.createElement("div")
test.setAttribute("onclick", "console.log('db')");
test.textContent = "test div"
document.body.appendChild(test)
console.log(test)
button.textContent= "test? "
document.body.appendChild(button)
console.log(button)
}//