import axios from 'axios';
import Swal from 'sweetalert2';
import { store } from 'store';
import { IS_LOADING } from 'store/actions';

const useAxios = async (config) => {
    axios.interceptors.request.use(
        (config) => {
            // Do something before request is sent
            store.dispatch({ type: IS_LOADING, isLoading: true });
            console.log(config);
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

    axios.interceptors.response.use(
        (response) => {
            store.dispatch({ type: IS_LOADING, isLoading: false });
            return response;
        },
        (error) => {
            // Do something with response error
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
    const response = await axios.request(config).catch((error) => {
        store.dispatch({ type: IS_LOADING, isLoading: false });
        console.log(error);
        Swal.fire({
            icon: 'error',
            title: 'Terjadi kesalahan!',
            text: 'Silakan coba beberapa saat lagi'
        });
    });

    return response;
};

export default useAxios;
