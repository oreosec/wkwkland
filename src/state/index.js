import { applyMiddleware, createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

// reducer
import authReducer from "./auth/auth-reducer";
import moderatorReducer from "./moderator/moderator-reducer";
import mentorReducer from "./mentor/mentor-reducer";

const reducers = combineReducers({
    moderator: moderatorReducer,
    mentor: mentorReducer,
    auth: authReducer,
});

const store = createStore(
    reducers,
    {},
    composeWithDevTools(applyMiddleware(thunk))
);

export default store;
