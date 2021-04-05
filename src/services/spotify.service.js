import axios from 'axios';

import { authService } from './auth.service';

const BASE_URL = 'https://api.spotify.com/v1'

async function getData(endpoint) {
    try {
        const token = await authService.getToken();
        const { data } = await axios.get(`${BASE_URL}/${endpoint}`, _createHeaders(token));
        return data;
    } catch (err) {
        console.log('failed to get user playlists', err)
    }
}

async function query(query, token) {
    try {
        const { data } = await axios.get(`${BASE_URL}/search?q=${query}&type=album,artist`, _createHeaders(token));
        const res = [...data.albums.items, ...data.artists.items];
        return res;
    } catch (err) {
        console.log('failed to search', err)
    }
}

async function playTrack(spotify_uri, deviceId, token) {
    try {
        const { data } = await axios.put(`${BASE_URL}/me/player/play`, { uris: spotify_uri, deviceId }, _createHeaders(token));
        return data;
    } catch (err) {
        console.log('failed to play track', err)
    }
}

async function transferPlayback(deviceId) {
    try {
        const token = await authService.getToken();
        const { data } = await axios.put(`${BASE_URL}/me/player`, { "device_ids": [deviceId], "play": false }, _createHeaders(token));
        return data;
    } catch (err) {
        console.log('failed to transfer playback', err)
    }
}

async function getAlbumTracks(id, token) {
    try {
        const { data } = await axios.get(`${BASE_URL}/albums/${id}/tracks`, _createHeaders(token));
        return data;
    } catch (err) {
        console.log('failed to get album tracks', err)
    }
}

async function getDetails(id, endpoint) {
    try {
        const token = await authService.getToken();
        const { data } = await axios.get(`${BASE_URL}/${endpoint}/${id}`, _createHeaders(token));
        return data;
    } catch (err) {
        console.log('failed to get album tracks', err)
    }
}

async function get(url, token) {
    try {
        const { data } = await axios.get(url, _createHeaders(token));
        return data;
    } catch (err) {
        console.log('failed to get album tracks', err)
    }
}

function _createHeaders(token) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
}

export const spotifyService = {
    getData,
    query,
    playTrack,
    transferPlayback,
    getAlbumTracks,
    get,
    getDetails
}