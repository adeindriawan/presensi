// project imports
import config from 'config';

// action - state management
import * as actionTypes from './actions';

export const initialState = {
    isOpen: [], // for active default menu
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    opened: true
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
        case actionTypes.SESSION_LOGIN: {
            const user = action.payload;
            return {
                ...state,
                loggedIn: true,
                user: {
                    ...initialState.user,
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    type: user.type
                }
            };
        }
        case actionTypes.SESSION_LOGOUT:
            return {
                ...state,
                loggedIn: false,
                user: {}
            };
        default:
            return state;
    }
};

export default customizationReducer;
