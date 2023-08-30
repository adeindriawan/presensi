import { combineReducers } from 'redux';
import customizationReducer from './customizationReducer';
import sessionReducer from './sessionReducer';
import taskReducer from './taskReducer'

const reducer = combineReducers({
    customization: customizationReducer,
    session: sessionReducer,
    task: taskReducer
});

export default reducer;
