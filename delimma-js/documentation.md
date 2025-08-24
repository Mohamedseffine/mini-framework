# MiniFramework Documentation

A lightweight, reactive JavaScript framework with **Virtual DOM**, **State Management**, and **Client-Side Routing** for building modern web applications.

---

## 🌟 Features

- **Virtual DOM**: Fast and efficient DOM updates through intelligent diffing.
- **State Management**: Simple, predictable state updates using a reducer-based approach.
- **Event System**: Automatic event binding and cleanup to prevent memory leaks.
- **Routing**: Hash-based navigation for seamless single-page app experiences.
- **Focus Preservation**: Maintains input focus and cursor position during updates for better UX.

---

## 🚀 Getting Started

Set up a basic app with state, view, and reducers, then mount it to the DOM.

```javascript
import { initApp } from './miniframework/core.js';
import { h } from './miniframework/vdom.js';

const app = initApp({
    state: { counter: 0 },
    view: (state, dispatch) => 
        h('div', { class: 'app-container' }, [
            h('p', {}, `Counter: ${state.counter}`),
            h('button', {
                on: { click: () => dispatch('increment') }
            }, 'Add')
        ]),
    reducers: {
        increment: (state) => ({ ...state, counter: state.counter + 1 })
    }
});

app.mount(document.querySelector('#root'));
```

---

## 📚 API Overview

### Creating Elements

Use the `h` function to create virtual DOM elements with tags, attributes, and children.

```javascript
// Basic element
h('h1', {}, 'Hello, MiniFramework!')

// Element with attributes and events
h('input', {
    class: 'text-input',
    type: 'text',
    placeholder: 'Enter your text...',
    on: {
        input: (e) => dispatch('updateInput', e.target.value),
        keypress: (e) => e.key === 'Enter' && dispatch('submit')
    }
})

// Nested elements
h('div', { class: 'panel' }, [
    h('h2', {}, 'Section Title'),
    h('p', {}, 'Some content here'),
    h('button', {
        on: { click: () => dispatch('triggerAction') }
    }, 'Click Me')
])
```

---

### State Management

Define reducers to handle state updates in a predictable, immutable way.

```javascript
const reducers = {
    // Update a single value
    setInput: (state, value) => ({ ...state, input: value }),

    // Add a task
    addTask: (state) => ({
        ...state,
        tasks: [...state.tasks, {
            id: Date.now(),
            text: state.input,
            done: false
        }],
        input: ''
    }),

    // Toggle task completion
    toggleTask: (state, id) => ({
        ...state,
        tasks: state.tasks.map(task =>
            task.id === id ? { ...task, done: !task.done } : task
        )
    })
};
```

---

### View Function

The `view` function defines the UI structure based on the current state and supports action dispatching.

```javascript
function view(state, dispatch, navigate) {
    const { tasks, input } = state;

    return h('div', { class: 'task-app' }, [
        h('h1', {}, 'Task Manager'),
        h('input', {
            placeholder: 'Add a task...',
            value: input,
            on: {
                input: (e) => dispatch('setInput', e.target.value),
                keypress: (e) => e.key === 'Enter' && dispatch('addTask')
            }
        }),
        h('ul', { class: 'task-list' }, 
            tasks.map(task =>
                h('li', { class: task.done ? 'done' : '' }, [
                    h('span', {}, task.text),
                    h('button', {
                        on: { click: () => dispatch('toggleTask', task.id) }
                    }, task.done ? 'Undo' : 'Complete')
                ])
            )
        )
    ]);
}
```

---

## 🛠️ How It Works

### Virtual DOM Workflow
1. **Action Trigger**: `dispatch('action', payload)` calls a reducer.
2. **State Update**: Reducer returns a new immutable state.
3. **Render**: View function generates a new virtual DOM tree.
4. **Diffing**: Compares old and new virtual DOM for changes.
5. **Patching**: Applies minimal updates to the real DOM.

### Architecture Principles
- **Unidirectional Data Flow**: State drives the view, actions update the state.
- **Pure Reducers**: Ensure predictable and testable state changes.
- **Optimized Rendering**: Reduces DOM operations for better performance.
- **Memory Safety**: Automatically unbinds events to prevent leaks.

### Event Handling
Events are managed efficiently with automatic cleanup:

```javascript
element.addEventListener('click', handler); // Added on mount
element.removeEventListener('click', handler); // Removed on unmount
```

### Focus Preservation
The framework ensures input fields retain focus and cursor position during updates, enhancing form usability.

---

## ⚡ Performance Highlights
- **Minimal DOM Updates**: Only modified elements are touched.
- **Batched State Changes**: Groups multiple updates into a single render.
- **Render Guards**: Prevents unnecessary re-renders.
- **Efficient Diffing**: Optimizes comparisons with type checks and early exits.

---

## 📝 Example: Task Manager
The Task Manager demo illustrates:
- Dynamic task list rendering.
- Form input handling with validation.
- State management for task creation and completion.
- Hash-based routing for view navigation.
- Inline editing with focus preservation.

---

Developed by **Mohamed Seffine** and **Hatim Tahiri**