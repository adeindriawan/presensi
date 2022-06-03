import axios from 'axios';
import { isLoading } from 'store/actions';

const apiMiddleware =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        next(action);

        // Add a request interceptor
        axios.interceptors.request.use(
            (config) => {
                // Do something before request is sent
                dispatch(isLoading(true));
                return config;
            },
            (error) =>
                // Do something with request error
                Promise.reject(error)
        );

        // Add a response interceptor
        axios.interceptors.response.use(
            (response) => {
                // Any status code that lie within the range of 2xx cause this function to trigger
                // Do something with response data
                dispatch(isLoading(false));
                return response;
            },
            (error) =>
                // Any status codes that falls outside the range of 2xx cause this function to trigger
                // Do something with response error
                Promise.reject(error)
        );
    };

export default apiMiddleware;
