# Delimma.js

A lightweight JavaScript framework built from scratch to understand how modern frontend frameworks work internally.

Delimma.js abstracts DOM manipulation, routing, state management, and event handling while providing a simple API for building dynamic web applications.

This repository also contains a TodoMVC application built entirely using the framework.

---

# Features

* Virtual DOM abstraction
* Component-based rendering
* Custom event system
* Global state management
* Client-side routing
* Dynamic DOM updates
* TodoMVC implementation
* Lightweight architecture
* Framework built without React, Vue, Angular, or similar libraries

---

# Repository Structure

```bash
mini-framework/
│
├── delimma-js/        # Framework source code
│
├── todos/             # TodoMVC application using the framework
│
├── push.sh
└── README.md
```

---

# Installation

Clone the repository:

```bash
git clone https://github.com/Mohamedseffine/mini-framework.git
cd mini-framework
```

Install dependencies:

```bash
npm install
```

---

# Running the Project

Run the development server:

```bash
npm run dev
```

The TodoMVC application will run in the browser using the custom framework.

---

# What is Delimma.js?

Modern frameworks abstract browser APIs into simpler developer-friendly systems.

Instead of manually creating and updating DOM elements using imperative JavaScript, Delimma.js allows developers to describe UI components declaratively.

The framework internally handles:

* DOM creation
* Event binding
* State synchronization
* Route changes
* UI re-rendering

---

# DOM Abstraction

HTML elements are represented as JavaScript objects before being rendered into the real DOM.

Example:

```js
createElement("div", { class: "container" }, [
  createElement("h1", {}, ["Hello World"])
])
```

Equivalent HTML:

```html
<div class="container">
  <h1>Hello World</h1>
</div>
```

This abstraction makes DOM updates easier to manage and allows the framework to update only modified elements.

---

# Creating Elements

Elements are created using the framework's element creation API.

Syntax:

```js
createElement(tag, attributes, children)
```

Example:

```js
const button = createElement(
  "button",
  { class: "btn" },
  ["Click Me"]
)
```

---

# Nesting Elements

Elements can contain other elements as children.

Example:

```js
const app = createElement("div", { class: "app" }, [
  createElement("h1", {}, ["Todo App"]),
  createElement("button", {}, ["Add Todo"])
])
```

---

# Adding Attributes

Attributes are passed as JavaScript objects.

Example:

```js
createElement("input", {
  type: "text",
  placeholder: "Enter todo..."
})
```

Supported attributes include:

* class
* id
* placeholder
* type
* value
* data attributes
* accessibility attributes

---

# Event Handling

Delimma.js provides a custom event system instead of directly exposing `addEventListener()`.

Example:

```js
onClick(button, () => {
  console.log("Clicked")
})
```

Supported events include:

* click
* input
* submit
* change
* keydown
* keyup

This abstraction simplifies event registration and keeps framework logic consistent.

---

# State Management

The framework contains a centralized state system shared across components.

Example:

```js
store.setState({
  todos: []
})
```

Reading state:

```js
const todos = store.getState().todos
```

Subscribing to updates:

```js
store.subscribe(() => {
  render()
})
```

Whenever the state changes, subscribed components automatically update.

---

# Routing System

The routing system synchronizes the browser URL with the application state.

Example:

```js
router.addRoute("/", HomePage)
router.addRoute("/todos", TodoPage)
```

Navigation:

```js
router.navigate("/todos")
```

When the URL changes, the framework dynamically renders the correct page without reloading the browser.

---

# Rendering System

The rendering engine converts virtual elements into real DOM nodes.

Example:

```js
render(App(), document.getElementById("root"))
```

The framework updates only the necessary parts of the DOM to improve performance and reduce unnecessary rendering.

---

# TodoMVC

This repository includes a TodoMVC implementation built entirely with Delimma.js.

Implemented features:

* Add todos
* Delete todos
* Toggle completed state
* Dynamic rendering
* Persistent state updates
* Filtering tasks
* Reactive UI updates

The TodoMVC project demonstrates how the framework handles real-world frontend application behavior.

---

# Why This Framework Exists

The purpose of this project is educational.

Building a framework from scratch helps understand:

* How virtual DOM systems work
* How frameworks synchronize UI and state
* How routing systems function
* How component rendering works internally
* Why modern frontend frameworks are structured the way they are

This project reproduces many core frontend concepts on a smaller scale to better understand frontend architecture.

---

# Technologies Used

* JavaScript
* HTML
* CSS

---

# Limitations

Current limitations include:

* No server-side rendering
* Basic diffing system
* No hooks system
* Limited optimization
* No TypeScript support

---

# Future Improvements

Possible future improvements:

* Advanced virtual DOM diffing
* Hooks/state lifecycle system
* Improved router
* Component lifecycle methods
* Animation support
* Better performance optimization
