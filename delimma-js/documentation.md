# Mini Framework

A lightweight, reactive JavaScript framework with **virtual DOM**, **state management**, and **routing**

---

## ✨ Features

- **Virtual DOM** – Efficient DOM updates through diffing  
- **State Management** – Redux-like reducers and actions  
- **Event Handling** – Automatic event cleanup  
- **Routing** – Hash-based navigation  
- **Focus Management** – Preserves input state during updates  

---

## 🚀 Quick Start

```javascript
import { createApp } from './src/app.js';
import { FcreateElement } from './src/h.js';

const app = FcreateApp({
    state: { count: 0 },
    view: (state, Femit) => 
        FcreateElement('div', {}, [
            FcreateElement('p', {}, [`Count: ${state.count}`]),
            FcreateElement('button', {
                on: { click: () => Femit('increment') }
            }, ['Increment'])
        ]),
    reducers: {
        increment: (state) => ({ ...state, count: state.count + 1 })
    }
});

app.Fmount(document.getElementById('app'));
```

---

## 📖 API Reference

### Creating Elements

```javascript
// Basic element
FcreateElement('h1', {}, ['Hello World'])

// With attributes and events
FcreateElement('input', {
    class: 'form-input',
    type: 'text',
    placeholder: 'Enter text...',
    on: {
        input: (e) => Femit('textChanged', e.target.value),
        keypress: (e) => {
            if (e.key === 'Enter') {
                Femit('submitForm');
            }
        }
    }
})

// Nested elements
FcreateElement('div', { class: 'card' }, [
    FcreateElement('h2', {}, ['Title']),
    FcreateElement('p', {}, ['Content']),
    FcreateElement('button', {
        on: { click: () => Femit('cardAction') }
    }, ['Action'])
])
```

---

### State Management

```javascript
const reducers = {
    // Simple update
    updateName: (state, name) => ({ ...state, name }),
    
    // Complex update
    addTodo: (state) => ({
        ...state,
        todos: [...state.todos, {
            id: Date.now(),
            text: state.newTodo,
            completed: false
        }],
        newTodo: ''
    }),
    
    // Conditional update
    toggleTodo: (state, id) => ({
        ...state,
        todos: state.todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
    })
};
```

---

### View Function

```javascript
function view(state, Femit, navigate) {
    const { todos, filter } = state;
    
    return FcreateElement('div', { class: 'app' }, [
        FcreateElement('h1', {}, ['Todo App']),
        
        FcreateElement('input', {
            placeholder: 'Add todo...',
            value: state.newTodo,
            on: {
                input: e => Femit('updateNewTodo', e.target.value),
                keypress: e => e.key === 'Enter' && Femit('addTodo')
            }
        }),
        
        FcreateElement('ul', {},
            todos.map(todo =>
                FcreateElement('li', {}, [
                    FcreateElement('span', {}, [todo.text]),
                    FcreateElement('button', {
                        on: { click: () => Femit('toggleTodo', todo.id) }
                    }, [todo.completed ? 'Undo' : 'Complete'])
                ])
            )
        )
    ]);
}
```

---

## ⚙️ How It Works

### Virtual DOM Flow
1. **State Change** → `Femit('action', payload)` triggers reducer  
2. **New State** → Reducer returns updated state  
3. **Re-render** → View function generates new virtual DOM  
4. **Diffing** → Framework compares old vs new virtual trees  
5. **Patching** → Only changed elements are updated in real DOM  

### Architecture
- **Unidirectional Data Flow** → State → View → Actions → State  
- **Pure Functions** → Reducers are predictable and testable  
- **Efficient Updates** → Smart diffing minimizes DOM operations  
- **Memory Safe** → Automatic cleanup prevents memory leaks  

### Event System

Framework manages event binding & cleanup:

```javascript
element.onclick = handler;  // Added during mount
element.onclick = null;     // Removed during unmount
```

### Focus Preservation

The framework **maintains input focus and cursor position** during updates, making forms responsive and natural.

---

## ⚡ Performance Features

- **Minimal DOM Operations** – Only necessary changes are applied  
- **Batched Updates** – Multiple state changes render once  
- **Smart Re-rendering** – Guards prevent concurrent renders  
- **Efficient Diffing** – Type checking and bailouts optimize performance  

---

## 📝 Example: TodoMVC

The included **TodoMVC** demo shows:

- Complex state management  
- Dynamic list rendering  
- Form handling & validation  
- Routing between views  
- Inline editing with focus management  

---

created by **Mohamed Seffine** and **Hatim Tahiri**