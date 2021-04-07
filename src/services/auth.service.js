import axios from 'axios';

const BASE_URL = '//localhost:3030/api/auth';

const Axios = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
})

async function getAuth() {
    try {
        const { data } = await Axios.get();
        return data;
    } catch (err) {
        console.log('login failed in spotify service', err)
    }
}

async function getToken() {
    try {
        const { data } = await Axios.get('/token');
        return data;
    } catch (err) {
        console.log('failed to get token', err)
    }
}

async function logout() {
    try {
        await Axios.post('/logout');
    } catch (err) {
        console.log('failed to logout');
    }
}

export const authService = {
    getAuth,
    getToken,
    logout
}