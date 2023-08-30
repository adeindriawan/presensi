// project imports

import * as actionTypes from './actions';

import config from '@/config';

// action - state management


export const initialState = {
    isOpen: [], // for active default menu
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    opened: true,
    app: {
        isLoading: false
    }
};

const customizationReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.MENU_OPEN: {
            const id = action.id;
            return {
                ...state,
                isOpen: [id]
            };
        }
        case actionTypes.SET_MENU:
            return {
                ...state,
                opened: action.opened
            };
        case actionTypes.SET_FONT_FAMILY:
            return {
                ...state,
                fontFamily: action.fontFamily
            };
        case actionTypes.SET_BORDER_RADIUS:
            return {
                ...state,
                borderRadius: action.borderRadius
            };
        case actionTypes.IS_LOADING: {
            const isLoading = action.payload;
            return {
                ...state,
                app: {
                    ...state.app,
                    isLoading
                }
            };
        }

        default:
            return state;
    }
};

export default customizationReducer;
