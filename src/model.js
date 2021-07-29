export const newTodo = (description, id) => ({
  description,
  completed: false,
  id,
});

export const emptyApp = { todos: [], focus: null, filter: "/", nextId: 1 };

export const completedCount = ({ todos }) => todos.reduce(countIfCompleted, 0);

const countIfCompleted = (count, { completed }) => count + (completed ? 1 : 0);

export const addTodo = (description) => (app) => ({
  ...app,
  nextId: app.nextId + 1,
  todos: app.todos.concat([newTodo(description, app.nextId)]),
});

export const removeTodo = (id) => (app) => ({
  ...app,
  todos: app.todos.filter((todo) => todo.id !== id),
});

export const updateCompleted = (completed, id) => (app) => ({
  ...app,
  todos: app.todos.map((todo) =>
    todo.id === id ? { ...todo, completed } : todo
  ),
});

export const updateAllCompleted = (completed) => (app) => ({
  ...app,
  todos: app.todos.map((todo) => ({ ...todo, completed })),
});

export const removeAllCompleted = (app) => ({
  ...app,
  todos: app.todos.filter((todo) => !todo.completed),
});

export const setFilter = (filter) => (app) => {
  return {
    ...app,
    filter,
  };
};
