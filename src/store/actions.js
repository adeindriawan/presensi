import api from 'axios';

// action - customization reducer
export const SET_MENU = '@customization/SET_MENU';
export const MENU_TOGGLE = '@customization/MENU_TOGGLE';
export const MENU_OPEN = '@customization/MENU_OPEN';
export const SET_FONT_FAMILY = '@customization/SET_FONT_FAMILY';
export const SET_BORDER_RADIUS = '@customization/SET_BORDER_RADIUS';
export const IS_LOADING = '@app/IS_LOADING';
export const USER_LOGIN = '@app/USER_LOGIN';
export const USER_LOGOUT = '@app/USER_LOGOUT';
export const CHART_LOADING = '@app/CHART_LOADING';
export const CHART_LOADED = '@app/CHART_LOADED';

export const isLoading = (loadingState) => (dispatch) => {
    console.log('isLoading');
    dispatch({
        type: IS_LOADING,
        isLoading: loadingState
    });
};

export const userLogin = (userData) => (dispatch) => dispatch({ type: USER_LOGIN, userData });

export const fetchOrdersChartsData = () => (dispatch) => {
    console.log('dispatch on');
    dispatch({ type: CHART_LOADING }); // Loading starts
    api.get('http://itstekno.beta/api/get-test')
        .then((charts) => {
            console.log('fetching finished');
            console.log(charts.data);
            dispatch({
                type: CHART_LOADED, // Loading ends
                payload: charts.data
            });
        })
        .catch((error) => {
            // dispatch error
            dispatch({
                type: CHART_LOADED
            });
            console.log(error);
        });
};
