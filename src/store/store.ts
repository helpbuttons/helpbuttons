import { applyMiddleware, createStore } from "redux";
import reducers from "./reducers/reducer";
import thunk from "redux-thunk";

const middleware = applyMiddleware(thunk)
export const store = createStore(reducers, middleware);