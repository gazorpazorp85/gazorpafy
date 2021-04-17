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

async function query(query, token = authService.getToken()) {
    try {
        const { data } = await axios.get(`${BASE_URL}/search?q=${query}&type=album,artist,playlist,track&market=IL&limit=50`, _createHeaders(token));
        const res = {
            albums: data.albums.items,
            artists: data.artists.items,
            playlists: data.playlists.items,
            tracks: data.tracks.items
        };
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

async function updatePlayer(deviceId, endpoint = '') {
    try {
        const token = await authService.getToken();
        const { data } = await axios.put(`${BASE_URL}/me/player${endpoint}`, { "device_ids": [deviceId], "play": false }, _createHeaders(token));
        return data;
    } catch (err) {
        console.log('failed to transfer playback', err)
    }
}

async function getAlbumTracks(id) {
    try {
        const token = await authService.getToken();
        const { data } = await axios.get(`${BASE_URL}/albums/${id}/tracks?market=IL`, _createHeaders(token));
        return data;
    } catch (err) {
        console.log('failed to get album tracks', err)
    }
}

async function getDetails(id, endpoint) {
    try {
        const token = await authService.getToken();
        const { data } = await axios.get(`${BASE_URL}/${endpoint}/${id}?market=IL`, _createHeaders(token));
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
    updatePlayer,
    getAlbumTracks,
    get,
    getDetails,
}