import { id as ID } from "@most/prelude";
import {
  addTodo,
  updateTodo,
  updateCompleted,
  removeTodo,
  updateAllCompleted,
  removeAllCompleted,
  setFilter,
} from "./model";

const ENTER_KEY = "Enter";
// const ESC_KEY = 'Escape'

export const runAction = (app, action) => action(app);

export const handleAdd = (e) => {
  const value = e.target.value.trim();

  if (e.key !== ENTER_KEY || value.length === 0) {
    return ID;
  }
  e.target.value = "";
  return addTodo(value);
};

export const handleToggleAll = (e) => updateAllCompleted(e.target.checked);

export const handleComplete =
  ({ id }) =>
  (e) =>
    updateCompleted(e.target.checked, id);

export const handleUpdate = (e) => {
  const value = e.target.value.trim();
  if (e.key !== ENTER_KEY || value.length === 0) {
    return ID;
  }
  let newInput = document.getElementById("new-todo");
  let updateInput = document.getElementById("update-todo");
  newInput.style.display = "block";
  updateInput.style.display = "none";
  e.target.value = "";
  return updateTodo(value, parseInt(e.target.dataset.todoid));
};

export const handleRemove =
  ({ id }) =>
  (e) =>
    removeTodo(id);

export const handleRemoveAllCompleted = (e) => removeAllCompleted;

export const handleFilterChange = (e) =>
  setFilter(e.newURL.replace(/^.*#/, ""));
