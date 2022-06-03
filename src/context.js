import { createContext, useReducer } from 'react';

const initialState = {
    isLoading: false
};
const store = createContext(initialState);
const { Provider } = store;

// eslint-disable-next-line react/prop-types
const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case 'isLoading':
                return {
                    ...state,
                    isLoading: true
                };

            case 'isLoaded':
                return {
                    ...state,
                    isLoading: false
                };

            default:
                throw new Error();
        }
    }, initialState);

    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
