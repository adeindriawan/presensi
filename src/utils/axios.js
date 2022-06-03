import axios from 'axios';
import Swal from 'sweetalert2';
import { store } from 'store';
import { IS_LOADING } from 'store/actions';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
    (config) => {
        // Do something before request is sent
        store.dispatch({ type: IS_LOADING, isLoading: true });
        return config;
    },
    (error) => {
        // Do something with request error
        store.dispatch({ type: IS_LOADING, isLoading: false });
        Promise.reject(error);
        console.log(error);
        Swal.fire({
            icon: 'error',
            title: 'Terjadi kesalahan!',
            text: 'Silakan coba beberapa saat lagi'
        });
    }
);

axiosInstance.interceptors.response.use(
    (response) =>
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        response,
    (error) =>
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        Promise.reject(error)
);

const useAxios = async (config) => {
    const response = {};
    // axios.interceptors.request.use(
    //     (config) => {
    //         // Do something before request is sent
    //         store.dispatch({ type: IS_LOADING, isLoading: true });
    //         return config;
    //     },
    //     (error) => {
    //         // Do something with request error
    //         store.dispatch({ type: IS_LOADING, isLoading: false });
    //         Promise.reject(error);
    //         console.log(error);
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Terjadi kesalahan!',
    //             text: 'Silakan coba beberapa saat lagi'
    //         });
    //     }
    // );

    // axios.interceptors.response.use(
    //     (response) => {
    //         store.dispatch({ type: IS_LOADING, isLoading: false });
    //         return response;
    //     },
    //     (error) => {
    //         // Do something with response error
    //         store.dispatch({ type: IS_LOADING, isLoading: false });
    //         Promise.reject(error);
    //         console.log(error);
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Terjadi kesalahan!',
    //             text: 'Silakan coba beberapa saat lagi'
    //         });
    //     }
    // );
    // const response = await axios.request(config).catch((error) => {
    //     store.dispatch({ type: IS_LOADING, isLoading: false });
    //     console.log(error);
    //     Swal.fire({
    //         icon: 'error',
    //         title: 'Terjadi kesalahan!',
    //         text: 'Silakan coba beberapa saat lagi'
    //     });
    // });

    return response;
};

export default axiosInstance;
