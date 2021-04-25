import Vue from 'vue'
import Vuex from 'vuex'

import { authService } from '../services/auth.service';
import { spotifyService } from '../services/spotify.service';
import { utilService } from '../services/util.service';

import { playerStore } from './modules/player';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggedInUser: null,
    token: null,
    userData: []
  },
  getters: {
    loggedInUser({ loggedInUser }) {
      return loggedInUser;
    },
    token({ token }) {
      return token;
    },
    userData({ userData }) {
      return userData;
    }
  },
  mutations: {
    loggedInUser(state, { user }) {
      state.loggedInUser = user;
    },
    token(state, { token }) {
      state.token = token;
    },
    userData(state, { data }) {
      state.userData.push(data);
    }
  },
  actions: {
    async login({ commit, dispatch }) {
      try {
        const user = await authService.getAuth();
        commit({ type: 'loggedInUser', user })
        dispatch('token');
      } catch (err) {
        console.log('err in getting user', err);
        throw err;
      }
    },
    async token({ commit }) {
      try {
        const token = await authService.getToken();
        commit({ type: 'token', token })
      } catch (err) {
        console.log('err in getting token', err);
        throw err;
      }
    },
    async getUserData({ commit, dispatch }) {
      const endpoints = [
        { endpoint: 'me/playlists', title: 'my playlists', type: 'playlist' },
        { endpoint: 'me/top/artists', title: 'my top artists', type: 'artists' },
      ];
      for (let i = 0; i < endpoints.length; i++) {
        const { endpoint, title, type } = endpoints[i];
        try {
          const { items } = await spotifyService.getData(endpoint);
          const data = { id: utilService.getRandomId(), title, items, type };
          commit({ type: 'userData', data });
        } catch (err) {
          console.log('err in getting user data', err);
          throw err;
        }
      };
    },
    async getRecommendations({ commit, getters }) {
      try {
        const { userData, token } = getters;
        const [artists] = userData.filter(data => data.type === 'artists').map(({ items }) => items);
        const seed_artists = artists.map(item => item.id).slice(0, 5) + '';
        const endpoint = `recommendations?market=IL&seed_artists=${seed_artists}`;
        const { tracks } = await spotifyService.getData(endpoint);
        const albums = tracks.map(({ album }) => album);
        commit({ type: 'userData', data: { id: utilService.getRandomId(), title: `recommended for today`, items: albums, type: 'albums' } });
        let artistsInfo = [];
        for (let i = 0; i < tracks.length; i++) {
          const artistData = await spotifyService.get(tracks[i].artists[0].href, token);
          artistsInfo.push(artistData);
        }
        const items = Array
          .from(new Set(artistsInfo.map(artist => artist.id)))
          .map(id => artistsInfo.find(artist => artist.id === id))
          .splice(0, 1);
        const data = { id: utilService.getRandomId(), title: `similar to ${tracks[0].artists[0].name}`, items, type: 'artists' };
        commit({ type: 'userData', data });
      } catch (err) {
        console.log('err in getting recommendations', err);
        throw err;
      }
    },
    async getFeaturedPlaylists({ commit, getters }) {
      try {
        const { token } = getters;
        const { playlists } = await spotifyService.get('https://api.spotify.com/v1/browse/featured-playlists?locale=en_US', token);
        const data = { id: utilService.getRandomId(), title: 'editor\'s pick', items: playlists.items, type: 'playlist' };
        commit({ type: 'userData', data });
      } catch (err) {
        console.log('err in getting recommendations', err);
        throw err;
      }
    }
  },
  modules: {
    playerStore
  }
})
