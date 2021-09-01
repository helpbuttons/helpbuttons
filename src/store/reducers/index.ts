import { combineReducers } from "redux";
import filter from "./reducer";

const reducers = combineReducers({
    networks: filter,
});

export default reducers;