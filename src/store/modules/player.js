import { playerService } from '../../services/player.service';
import { spotifyService } from '../../services/spotify.service';

export const playerStore = {
  state: {
    player: null,
    playerState: null,
    deviceId: null,
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
    },
    position({ playerState }) {
      return playerState?.position;
    },
    duration({ playerState }) {
      return playerState?.duration;
    },
    songInfo({ playerState }) {
      const currentTrack = playerState?.track_window?.current_track;
      const albumImage = currentTrack?.album.images[0];
      const artistName = currentTrack?.artists.map(artist => artist.name).join(', ');
      const trackName = currentTrack?.name;
      const id = currentTrack?.id;
      return { artistName, albumImage, id, trackName };
    }
  },
  mutations: {
    player(state, { player }) {
      state.player = player;
    },
    deviceId(state, { deviceId }) {
      state.deviceId = deviceId;
    },
    position(state, { newPosition }) {
      state.position = newPosition;
    },
    updateState(state, { currentState }) {
      state.playerState = currentState;
    },
  },
  actions: {
    init({ commit, dispatch }, token) {
      try {
        const player = new window.Spotify.Player({
          name: "Gazorpafy Player",
          getOAuthToken: cb => { cb(token); },
        });
        commit({ type: 'player', player });
        playerService.createEventHandlers(player, dispatch, commit);
        player.connect();
      } catch (err) {
        console.log('failed to initialize player', err);
      }
    },
    async updateState({ commit }, { newState }) {
      const currentState = newState ?? await this.getters.player.getCurrentState();
      commit({ type: 'updateState', currentState })
    },
    play({ getters }) {
      const { player } = getters;
      player.togglePlay();
    },
    async seek({ getters, dispatch }, newPosition) {
      const { deviceId } = getters;
      try {
        await spotifyService.transferPlayback(deviceId, `/seek?position_ms=${newPosition}`);
        dispatch({ type: 'updateState' });
      } catch (err) {
        console.log('couldn\'t seek', err)
      }
    }
  },
}