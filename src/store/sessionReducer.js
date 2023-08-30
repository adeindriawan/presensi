import * as actionTypes from "./actions";

const savedSessionData = localStorage.getItem("session")
  ? JSON.parse(localStorage.getItem("session"))
  : null;

export const initialState = {
  accessToken: savedSessionData?.accessToken ?? null,
  tokenExpireAt: savedSessionData?.tokenExpireAt ?? null,
  user: savedSessionData?.user ?? {
    id: 0,
    name: "",
    email: "",
    type: "",
    isManager: false
  }
};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SESSION_LOGIN: {
      const { accessToken, tokenExpireAt, user } = action.payload;
      localStorage.setItem(
        "session",
        JSON.stringify({
          accessToken,
          tokenExpireAt,
          user,
        })
      );
      return {
        ...state,
        accessToken,
        tokenExpireAt,
        user,
      };
    }
    case actionTypes.SESSION_LOGOUT:
      localStorage.removeItem("session");
      return {
        ...state,
        accessToken: null,
        tokenExpireAt: null,
        user: {
          id: 0,
          name: "",
          email: "",
          type: "",
          isManager: false
        },
      };
    default:
      return state;
  }
};

export default sessionReducer;
