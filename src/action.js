import { id } from "@most/prelude";
import {
  addTodo,
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
    return id;
  }
  e.target.value = "";
  return addTodo(value);
};

export const handleToggleAll = (e) => updateAllCompleted(e.target.checked);

export const handleComplete =
  ({ id }) =>
  (e) =>
    updateCompleted(e.target.checked, id);

export const handleRemove =
  ({ id }) =>
  (e) =>
    removeTodo(id);

export const handleRemoveAllCompleted = (e) => removeAllCompleted;

export const handleFilterChange = (e) =>
  setFilter(e.newURL.replace(/^.*#/, ""));
