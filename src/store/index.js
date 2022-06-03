import { createStore, applyMiddleware } from 'redux';
import reducer from './reducer';
import thunkMiddleware from 'redux-thunk';
// import apiMiddleware from './middleware/api';

// ==============================|| REDUX - MAIN STORE ||============================== //
const middlewares = [thunkMiddleware];
const store = createStore(reducer, applyMiddleware(...middlewares));
const persister = 'Free';

export { store, persister };
