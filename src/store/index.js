import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducer';

// ==============================|| REDUX - MAIN STORE ||============================== //

const middlewares = [thunkMiddleware]; // loggerMiddleware
const middlewareEnhancer = composeWithDevTools(applyMiddleware(...middlewares));
const enhancers = [middlewareEnhancer];
const composedEnhancers = compose(...enhancers);
const store = createStore(reducer, composedEnhancers);
const persister = 'Free';

export { store, persister };
