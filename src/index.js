import { skipRepeats, map, merge, scan, tap, runEffects } from "@most/core";
import { newDefaultScheduler } from "@most/scheduler";
import { hashchange } from "@most/dom-event";
import { createAdapter } from "@most/adapter";
import "todomvc-common/base.css";
import "todomvc-app-css/index.css";

import { emptyApp } from "./model";
import { View } from "./view";
import { handleFilterChange } from "./action";
import ReactDOM from "react-dom";

const fail = (s) => {
  throw new Error(s);
};

//Query selector function
const qs = (s, el) => el.querySelector(s) || fail(`${s} not found`);

const appNode = qs(".todoapp", document);

//Initial app state when application loads
// emptyApp = { todos: [], focus: null, filter: "/", nextId: 1 }
const appState = localStorage.getItem("appState")
  ? {
      ...JSON.parse(localStorage.getItem("appState")),
      nextId: JSON.parse(localStorage.getItem("appState")).todos.length + 1,
    }
  : emptyApp;

//scheduler to create a new timeline for our stream
const scheduler = newDefaultScheduler();

//createAdaptor provides us an empty stream(todoActions) and a function(addAction) to add event to that stream.
// addAction("Something") will create a event in the stream todoActions
//todoActions stream : ----func expression----func expression--func expressions----->
const [addAction, todoActions] = createAdapter();

//updateFilter is stream which watches window haschange/url change event occurs and runs handlefilter change for those events
//updateFilter stream: ----func expression----func expression--func expressions----->
const updateFilter = map(
  (event) => handleFilterChange(event),
  hashchange(window)
);

//actions is a stream we get after merging todoActions(stream) and updateFilter(stream)
//actions stream: ----func expression----func expression--func expressions----->
const actions = merge(todoActions, updateFilter);

//stateUpdates stream contains all updated appState values

//stream:                           -1-2-3->
//scan((x, y) => x + y, 0, stream): 01-3-6->

//stateUpdates stream: ---intialAppState----appState----appState----appState----->
const stateUpdates = skipRepeats(
  scan((app, action) => action(app), appState, actions)
);

//Each time an event occurs in stateUpdates stream, it will re-render ReactDOM.
const viewUpdates = tap(
  (element) => ReactDOM.render(element, appNode),
  map((event) => View(addAction)(event), stateUpdates)
);

runEffects(viewUpdates, scheduler);
