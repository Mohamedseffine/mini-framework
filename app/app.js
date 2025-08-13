import { CreateElement } from "../framework/framework.js"

function TodoApp() {
    let todos = [
        { id: 1, text: "uwuwuwu hatim uwu", completed: false },
    ]

    const app = CreateElement('div', { class: 'todoapp' })
    
    // Header with input
    const header = CreateElement('header')
    const h1 = CreateElement('h1', {}, 'todos')
    const newTodoInput = CreateElement('input', {
        class: 'new-todo',
        placeholder: 'What needs to be done?',
        autofocus: true
    });
    
    header.appendChild(h1)
    header.appendChild(newTodoInput)
    app.appendChild(header)
    
    // Main section with todo list
    const main = CreateElement('section', { class: 'main' })
    const toggleAll = CreateElement('input', {
        class: 'toggle-all',
        id: 'toggle-all',
        type: 'checkbox'
    })
    const toggleAllLabel = CreateElement('label', { for: 'toggle-all' }, 'Mark all as complete')
    
    const todoList = CreateElement('ul', { class: 'todo-list' })
    
    // Render todos
    todos.forEach(todo => {
        const todoItem = CreateElement('li', { class: todo.completed ? 'completed' : '' })
        
        const viewDiv = CreateElement('div', { class: 'view' })
        const toggle = CreateElement('input', {
            class: 'toggle',
            type: 'checkbox',
            checked: todo.completed
        })
        const label = CreateElement('label', {}, todo.text)
        const destroyButton = CreateElement('button', { class: 'destroy' })
        
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
    const strong = CreateElement('strong', {}, todos.length.toString())
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
    
    const clearCompleted = CreateElement('button', { class: 'clear-completed' }, 'Clear completed')
    
    footer.appendChild(todoCount)
    footer.appendChild(filters)
    footer.appendChild(clearCompleted)
    app.appendChild(footer)
    
    return app
}

// Initialize the app
window.onload = function() {
    const root = document.getElementById('root')
    const todoApp = TodoApp()
    root.appendChild(todoApp)
};