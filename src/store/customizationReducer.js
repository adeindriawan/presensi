// project imports
import config from 'config';

// action - state management
import * as actionTypes from './actions';

export const initialState = {
    isOpen: [], // for active default menu
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    opened: true,
    user: {},
    app: {
        isLoading: false
    }
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const customizationReducer = (state = initialState, action) => {
    let id;
    switch (action.type) {
        case actionTypes.MENU_OPEN:
            id = action.id;
            return {
                ...state,
                isOpen: [id]
            };
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
        case actionTypes.IS_LOADING:
            return {
                ...state,
                app: {
                    isLoading: action.isLoading
                }
            };
        case actionTypes.USER_LOGIN:
            return {
                ...state,
                user: action.userData
            };
        case actionTypes.USER_LOGOUT:
            return {
                ...state,
                user: {}
            };
        case actionTypes.CHART_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case actionTypes.CHART_LOADED:
            return {
                ...state,
                isLoading: false
            };
        default:
            return state;
    }
};

export default customizationReducer;
