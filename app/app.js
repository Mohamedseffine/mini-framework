import { CreateElement } from "../framework/framework.js"

let allCompleted = false
let todos = [
    { id: 1, text: "uwuwuwu hatim uwu", completed: false },
]

// Add todo on Enter key
function test(kay) {
    let inputvalue = document.getElementById("todo-input")
    if (kay === "Enter" && inputvalue && inputvalue.value.trim() !== "") {
        let obj = {
            id: Date.now(),
            text: inputvalue.value,
            completed: false
        }
        todos.push(obj)
        allCompleted = false
        inputvalue.value = ""
        render()
    }
}
function destroy(todo){
         todos = todos.filter(item => item != todo) 
    render()
}

// Toggle all todos
function checkall() {
    for (let todo of todos) {
        todo.completed = !allCompleted
    }
    allCompleted = !allCompleted
    render()
}

// Main app
function TodoApp() {
    const app = CreateElement('div', { class: 'todoapp' })

    // Header
    const header = CreateElement('header')
    const h1 = CreateElement('h1', {}, 'todos')
    const newTodoInput = CreateElement('input', {
        id: "todo-input",
        class: 'new-todo',
        placeholder: 'What needs to be done?',
        autofocus: true,
        onkeydown: (event) => test(event.key)
    });
    header.appendChild(h1)
    header.appendChild(newTodoInput)
    app.appendChild(header)

    // Main section
    const main = CreateElement('section', { class: 'main' })

    const toggleAll = CreateElement('input', {
        class: 'toggle-all',
        id: 'toggle-all',
        type: 'checkbox',
        onclick: () => checkall()
    })
    toggleAll.checked = allCompleted // keep it in sync

    const toggleAllLabel = CreateElement('label', { for: 'toggle-all' }, 'Mark all as complete')

    const todoList = CreateElement('ul', { class: 'todo-list' })

    todos.forEach(todo => {
        const todoItem = CreateElement('li', { class: todo.completed ? 'completed' : '' })

        const viewDiv = CreateElement('div', { class: 'view' })

        // Checkbox
        const toggle = CreateElement('input', {
            class: 'toggle',
            type: 'checkbox',
            onclick: () => {
                todo.completed = !todo.completed
                render()
            }
        })
        toggle.checked = todo.completed // important fix

        // Label must be right after checkbox for CSS
        const label = CreateElement('label', {}, todo.text)

        const destroyButton = CreateElement('button', { 
            class: 'destroy',
            onclick : () => destroy(todo)
        })

        viewDiv.appendChild(toggle)
        viewDiv.appendChild(label)
        viewDiv.appendChild(destroyButton)
        todoItem.appendChild(viewDiv)

        const editInput = CreateElement('input', {
            class: 'edit',
            value: todo.text
        });
        todoItem.appendChild(editInput)

        todoList.appendChild(todoItem)
    })

    main.appendChild(toggleAll)
    main.appendChild(toggleAllLabel)
    main.appendChild(todoList)
    app.appendChild(main)

    // Footer
    const footer = CreateElement('footer', { class: 'footer' })
    const todoCount = CreateElement('span', { class: 'todo-count' })
    const strong = CreateElement('strong', {}, todos.filter(t => !t.completed).length.toString())
    todoCount.appendChild(strong);
    todoCount.appendChild(document.createTextNode(' items left'))

    const filters = CreateElement('ul', { class: 'filters' })
    const allFilter = CreateElement('li')
    allFilter.appendChild(CreateElement('a', { class: 'selected', href: '#/' }, 'All'))

    const activeFilter = CreateElement('li');
    activeFilter.appendChild(CreateElement('a', { href: '#/active' }, 'Active'))

    const completedFilter = CreateElement('li');
    completedFilter.appendChild(CreateElement('a', { href: '#/completed' }, 'Completed'))

    filters.appendChild(allFilter)
    filters.appendChild(activeFilter)
    filters.appendChild(completedFilter)

    const clearCompleted = CreateElement('button', {
        class: 'clear-completed',
        onclick: () => {
            todos = todos.filter(t => !t.completed)
            render()
        }
    }, 'Clear completed')

    footer.appendChild(todoCount)
    footer.appendChild(filters)
    footer.appendChild(clearCompleted)
    app.appendChild(footer)

    return app
}

// Render function
function render() {
    allCompleted = todos.length > 0 && todos.every(t => t.completed)
    const root = document.getElementById('root')
    root.innerHTML = ""
    root.appendChild(TodoApp())
}

// Initialize
window.onload = render
