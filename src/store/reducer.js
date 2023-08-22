import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './customizationReducer';
import sessionReducer from './sessionReducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    customization: customizationReducer,
    session: sessionReducer
});

export default reducer;
