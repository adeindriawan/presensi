import axios from 'axios';
import wrapPromise from './wrapPromise';

export const getData = (url) => {
    axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
    const promise = axios.get(url).then((res) => res.data);

    return wrapPromise(promise);
};

export const postData = (url, data) => {
    axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
    const promise = axios.post(url, data).then((res) => res.data);

    return wrapPromise(promise);
};
