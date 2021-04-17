import Vue from 'vue'
import Vuex from 'vuex'

import { authService } from '../services/auth.service';
import { spotifyService } from '../services/spotify.service';

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
    async getUserData({ commit }) {
      const endpoints = [
        { endpoint: 'me/playlists', title: 'my playlists', type: 'playlist' },
        { endpoint: 'me/top/artists', title: 'my top artists', type: 'artists' },
        // { endpoint: 'me/top/tracks', title: 'my top tracks', type: 'tracks' }
      ];
      for (let i = 0; i < endpoints.length; i++) {
        const { endpoint, title, type } = endpoints[i];
        try {
          const { items } = await spotifyService.getData(endpoint);
          console.log('items getUserData', items);
          const data = { id: `p${i}`, title, items, type };
          commit({ type: 'userData', data });
        } catch (err) {
          console.log('err in getting user data', err);
          throw err;
        }
      }
    },
  },
  modules: {
    playerStore
  }
})
