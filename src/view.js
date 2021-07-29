import { compose } from "@most/prelude";
import * as React from "react";
import { completedCount } from "./model";
import {
  handleAdd,
  handleToggleAll,
  handleComplete,
  handleRemove,
  handleRemoveAllCompleted,
} from "./action";

const maybeClass = (className) => (condition) => condition ? className : "";
const ifCompleted = maybeClass("completed");
const ifSelected = maybeClass("selected");

const filterTodos = ({ filter, todos }) =>
  todos.filter((t) => {
    switch (filter) {
      case "/":
        return true;
      case "/active":
        return !t.completed;
      case "/completed":
        return t.completed;
      default:
        return false;
    }
  });

export const View = (addAction) => (appState) => {
  const completed = completedCount(appState);
  const todos = appState.todos;
  const filtered = filterTodos(appState);
  const remaining = todos.length - completed;
  localStorage.setItem("appState", JSON.stringify(appState));
  console.log(appState);
  //console.log(completed, todos, filtered, remaining);

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          name="new-todo"
          placeholder="What needs to be done?"
          autoComplete="off"
          autoFocus
          onKeyPress={compose(addAction, handleAdd)}
        />
      </header>
      <TodoList
        addAction={addAction}
        allCompleted={todos.length > 0 && remaining === 0}
      >
        {filtered.map((todo) => (
          <TodoItem key={todo.id} addAction={addAction} todo={todo} />
        ))}
      </TodoList>
      {todos.length > 0 && (
        <Footer
          addAction={addAction}
          remaining={remaining}
          completed={completed}
          filter={appState.filter}
        />
      )}
    </div>
  );
};

export const TodoList = ({ children, addAction, allCompleted }) => {
  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={allCompleted}
        onChange={compose(addAction, handleToggleAll)}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">{children}</ul>
    </section>
  );
};

export const TodoItem = ({ addAction, todo }) => {
  return (
    <li className={ifCompleted(todo.completed)}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={compose(addAction, handleComplete(todo))}
        />
        <label>{todo.description}</label>
        <button
          className="destroy"
          onClick={compose(addAction, handleRemove(todo))}
        />
      </div>
      <input className="edit" value={todo.description} />
    </li>
  );
};

export const Footer = ({ addAction, remaining, completed, filter }) => {
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remaining}</strong> {remaining === 1 ? "item" : "items"} left
      </span>
      <ul className="filters">
        <li>
          <a className={ifSelected(filter === "/")} href="#/">
            All
          </a>
        </li>
        <li>
          <a className={ifSelected(filter === "/active")} href="#/active">
            Active
          </a>
        </li>
        <li>
          <a className={ifSelected(filter === "/completed")} href="#/completed">
            Completed
          </a>
        </li>
      </ul>
      {completed > 0 && (
        <button
          className="clear-completed"
          onClick={compose(addAction, handleRemoveAllCompleted)}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
