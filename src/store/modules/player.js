import { playerService } from '../../services/player.service';

export const playerStore = {
  state: {
    player: null,
    playerState: null,
    deviceId: null
  },
  getters: {
    player({ player }) {
      return player;
    },
    playerState({ playerState }) {
      return playerState;
    },
    deviceId({ deviceId }) {
      return deviceId;
    }
  },
  mutations: {
    player(state, { player }) {
      state.player = player;
    },
    deviceId(state, { deviceId }) {
      state.deviceId = deviceId;
    },
    updateState(state, { currentState }) {
      console.log('player currentState: ', currentState);
      if (currentState) {
        const { current_track: currentTrack } = currentState.track_window;
        const { duration, position } = currentState;
        const albumImage = currentTrack.album.images[0];
        const albumName = currentTrack.album.name;
        const artistName = currentTrack.artists.map(artist => artist.name).join(', ');
        const trackName = currentTrack.name;
        const playing = !currentState.paused;
        const { id } = currentTrack;
        state.playerState = {
          albumImage,
          albumName,
          artistName,
          duration,
          id,
          playing,
          position,
          trackName,
        };
      }
    }
  },
  actions: {
    init({ commit, dispatch }, token) {
      const player = new window.Spotify.Player({
        name: "Gazorpafy Player",
        getOAuthToken: cb => { cb(token); },
      });
      commit({ type: 'player', player });
      const cb = () => dispatch({ type: 'updateState' });
      playerService.createEventHandlers(player, cb, commit);
      player.connect();
    },
    async updateState({ commit }) {
      const currentState = await this.getters.player.getCurrentState();
      commit({ type: 'updateState', currentState })
    }
  },
}