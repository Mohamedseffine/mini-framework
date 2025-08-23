import {FcreateElement, FcreateElementFragment} from "../delimma-js/elements-handler.js"
import { FcreateApp } from '../delimma-js/app.js';


const FILTERS = {
    ALL: 'all',
    ACTIVE: 'active',
    COMPLETED: 'completed'
};

let appState = {
    todos: [],
    newTodo: '',
    filter: FILTERS.ALL,
    editingId: null,
    editingText: ''
};

const reducers = {
    updateNewTodo: (state, value) => ({ ...state, newTodo: value }),

    addTodo: (state) => {
        const text = state.newTodo.trim();
        if (!text) return state;

        const newState = {
            ...state,
            todos: [...state.todos, {
                id: Date.now(),
                text,
                completed: false
            }],
            newTodo: ''
        };

        return newState;
    },

    toggleTodo: (state, id) => ({
        ...state,
        todos: state.todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
    }),

    deleteTodo: (state, id) => ({
        ...state,
        todos: state.todos.filter(todo => todo.id !== id)
    }),

    startEditing: (state, { id, text }) => ({
        ...state,
        editingId: id,
        editingText: text
    }),

    updateEditingText: (state, text) => ({
        ...state,
        editingText: text
    }),

    saveEdit: (state) => {
        const trimmedText = state.editingText.trim();
        if (!trimmedText) {
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== state.editingId),
                editingId: null,
                editingText: ''
            };
        }

        return {
            ...state,
            todos: state.todos.map(todo =>
                todo.id === state.editingId
                    ? { ...todo, text: trimmedText }
                    : todo
            ),
            editingId: null,
            editingText: ''
        };
    },

    cancelEdit: (state) => ({
        ...state,
        editingId: null,
        editingText: ''
    }),

    toggleAll: (state) => {
        const allCompleted = state.todos.every(todo => todo.completed);
        if (state.filter === FILTERS.COMPLETED) {
            return {
                ...state,
                todos: state.todos.map(todo => ({
                    ...todo,
                    completed: false
                }))
            };
        } else if (state.filter === FILTERS.ACTIVE) {
            return {
                ...state,
                todos: state.todos.map(todo => ({
                    ...todo,
                    completed: true
                }))
            };
        } else {
            return {
                ...state,
                todos: state.todos.map(todo => ({
                    ...todo,
                    completed: !allCompleted
                }))
            };
        }
    },

    clearCompleted: (state) => ({
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
    }),

    setFilter: (state, filter) => ({ ...state, filter }),

    routeChange: (state, path) => {
        let filter = FILTERS.ALL;
        if (path === '/active') filter = FILTERS.ACTIVE;
        if (path === '/completed') filter = FILTERS.COMPLETED;
        return { ...state, filter };
    }
};

function view(state, emit, navigate) {
    const { todos, newTodo, filter, editingId, editingText } = state;

    const filteredTodos = todos.filter(todo => {
        switch (filter) {
            case FILTERS.ACTIVE: return !todo.completed;
            case FILTERS.COMPLETED: return todo.completed;
            default: return true;
        }
    });

    const activeTodoCount = todos.filter(todo => !todo.completed).length;
    const completedTodoCount = todos.filter(todo => todo.completed).length;
    const allCompleted = todos.length > 0 && activeTodoCount === 0;

    return FcreateElementFragment([
        FcreateElement('header', { class: 'header' }, [
            FcreateElement('h1', {}, ['todos']),
            FcreateElement('div', { class: 'input-container' }, [
                FcreateElement('input', {
                    class: 'new-todo',
                    id: 'todo-input',
                    placeholder: 'What needs to be done?',
                    maxlength: 60,
                    value: newTodo,
                    type: 'text',
                    on: {
                        input: e => emit('updateNewTodo', e.target.value),
                        keypress: e => {
                            if (e.key === 'Enter' && e.target.value.length >= 2) {
                                e.preventDefault();
                                emit('addTodo');
                                setTimeout(() => {
                                    e.target.value = '';
                                }, 0);
                            }
                        }
                    }
                }),
                FcreateElement('label', { class: 'visually-hidden', for: 'todo-input' }, ['New Todo Input'])
            ])
        ]),

        todos.length > 0 ? FcreateElement('main', { class: 'main' }, [
            FcreateElement('div', {class: 'toggle-all-container'}, [
                FcreateElement('input', {
                    class: 'toggle-all',
                    type: 'checkbox',
                    id: 'toggle-all',
                    checked: allCompleted,
                    on: { change: () => emit('toggleAll') }
                }),
                FcreateElement('label', {
                    class: 'toggle-all-label',
                    for: 'toggle-all',
                    on: {
                        click: (e) => {
                            e.preventDefault();
                            emit('toggleAll');
                        }
                    }
                }, ['Mark all as complete'])
            ]),

            FcreateElement('ul', { class: 'todo-list' },
                filteredTodos.map(todo => {
                    const isEditing = editingId === todo.id;
                    const todoClass = [
                        todo.completed ? 'completed' : '',
                        isEditing ? 'editing' : ''
                    ].filter(Boolean).join(' ');

                    return FcreateElement('li', { class: todoClass }, [
                        FcreateElement('div', { class: 'view' }, [
                            FcreateElement('input', {
                                class: 'toggle',
                                type: 'checkbox',
                                'data-todo-id': todo.id.toString(),
                                checked: todo.completed,
                                on: { change: () => emit('toggleTodo', todo.id) }
                            }),
                            FcreateElement('label', {
                                on: {
                                    dblclick: () => emit('startEditing', {
                                        id: todo.id,
                                        text: todo.text
                                    })
                                }
                            }, [todo.text]),
                            FcreateElement('button', {
                                class: 'destroy',
                                on: { click: () => emit('deleteTodo', todo.id) }
                            })
                        ]),

                        isEditing ? FcreateElement('input', {
                            class: 'edit',
                            maxlength: 60,
                            value: editingText,
                            'data-todo-id': todo.id.toString(),
                            on: {
                                input: e => emit('updateEditingText', e.target.value),
                                blur: e => { emit('cancelEdit') },
                                keypress: e => {
                                    if (e.key === 'Enter' && e.target.value.trim().length >= 2) {
                                        e.preventDefault();
                                        emit('saveEdit');
                                    }
                                },
                            }
                        }) : null
                    ]);
                })
            )
        ]) : null,

        todos.length > 0 ? FcreateElement('footer', { class: 'footer' }, [
            FcreateElement('span', { class: 'todo-count' }, [
                FcreateElement('strong', {}, [activeTodoCount.toString()]),
                ` ${activeTodoCount === 1 ? 'item' : 'items'} left`
            ]),

            FcreateElement('ul', { class: 'filters' }, [
                FcreateElement('li', {}, [
                    FcreateElement('a', {
                        class: filter === FILTERS.ALL ? 'selected' : '',
                        href: '#/',
                        on: {
                            click: e => {
                                e.preventDefault();
                                navigate('/');
                                emit('setFilter', FILTERS.ALL);
                            }
                        }
                    }, ['All'])
                ]),
                FcreateElement('li', {}, [
                    FcreateElement('a', {
                        class: filter === FILTERS.ACTIVE ? 'selected' : '',
                        href: '#/active',
                        on: {
                            click: e => {
                                e.preventDefault();
                                navigate('/active');
                                emit('setFilter', FILTERS.ACTIVE);
                            }
                        }
                    }, ['Active'])
                ]),
                FcreateElement('li', {}, [
                    FcreateElement('a', {
                        class: filter === FILTERS.COMPLETED ? 'selected' : '',
                        href: '#/completed',
                        on: {
                            click: e => {
                                e.preventDefault();
                                navigate('/completed');
                                emit('setFilter', FILTERS.COMPLETED);
                            }
                        }
                    }, ['Completed'])
                ])
            ]),

            completedTodoCount > 0 ? FcreateElement('button', {
                class: 'clear-completed',
                on: { click: () => emit('clearCompleted') }
            }, ['Clear completed']) : FcreateElement('button', {
                class: 'clear-completed',
                disabled: true,
                on: { click: () => emit('clearCompleted') }
            }, ['Clear completed'])
        ]) : null
    ]);
}

const app = FcreateApp({
    state: appState,
    view,
    reducers
});

const hash = window.location.hash.slice(2);
if (hash === 'active') {
    appState.filter = FILTERS.ACTIVE;
} else if (hash === 'completed') {
    appState.filter = FILTERS.COMPLETED;
}

app.mount(document.getElementById('root'));