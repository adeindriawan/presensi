import * as actionTypes from 'session/actions';

const initialState = {
    loggedIn: false,
    user: {
        name: 'Dummy Account',
        email: 'dummy@example.com',
        avatar: '/images/avatars/avatar_11.png',
        type: 'Dummy Employee',
        role: 'ADMIN' // ['GUEST', 'USER', 'ADMIN']
    }
};

const sessionReducer = (state = initialState, action) => {
    const { user } = action;

    switch (action.type) {
        case actionTypes.SESSION_LOGIN: {
            return {
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

        case actionTypes.SESSION_LOGOUT: {
            return {
                ...state,
                loggedIn: false,
                user: {
                    role: 'GUEST'
                }
            };
        }

        default: {
            return state;
        }
    }
};

export default sessionReducer;
