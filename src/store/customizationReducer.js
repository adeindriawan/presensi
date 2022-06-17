// project imports
import config from 'config';

// action - state management
import * as actionTypes from './actions';

export const initialState = {
    isOpen: [], // for active default menu
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    opened: true,
    app: {
        isLoading: false
    },
    account: {
        loggedIn: false,
        user: {}
    },
    tasks: {
        recentTasks: [],
        todayTasks: []
    },
    work: {
        started: false,
        ended: false
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
        case actionTypes.SESSION_LOGIN: {
            const user = action.payload;
            return {
                ...state,
                account: {
                    loggedIn: true,
                    user: {
                        ...state.account.user,
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        type: user.type
                    }
                }
            };
        }
        case actionTypes.SESSION_LOGOUT:
            return {
                ...state,
                account: {
                    loggedIn: false,
                    user: {}
                },
                tasks: {
                    recentTasks: [],
                    todayTasks: []
                }
            };
        case actionTypes.RECENT_TASKS: {
            const recentTasks = action.payload;
            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    recentTasks
                }
            };
        }
        case actionTypes.TODAY_TASKS: {
            const todayTasks = action.payload;
            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    todayTasks
                }
            };
        }
        case actionTypes.WORK_STARTED:
            return {
                ...state,
                work: {
                    ...state.work,
                    started: true
                }
            };
        case actionTypes.WORK_ENDED:
            return {
                ...state,
                work: {
                    ...state.work,
                    ended: true
                }
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
