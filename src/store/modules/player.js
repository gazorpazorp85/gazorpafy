import { playerService } from '../../services/player.service';
import { socketService } from '../../services/socket.service';
import { spotifyService } from '../../services/spotify.service';

export const playerStore = {
  state: {
    player: null,
    playerState: null,
    deviceId: null,
    deviceState: null
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
    isPlaying({ deviceState }) {
      return deviceState?.is_playing;
    },
    songInfo({ playerState }) {
      const currentTrack = playerState?.track_window?.current_track;
      const albumImage = currentTrack?.album.images[0];
      const artistName = currentTrack?.artists.map(artist => artist.name).join(', ');
      const trackName = currentTrack?.name;
      const id = currentTrack?.id;
      return { artistName, albumImage, id, trackName };
    },
    shuffleState({ deviceState }) {
      return deviceState?.shuffle_state;
    },
    repeatState({ deviceState }) {
      return deviceState?.repeat_state;
    },
    volume({ deviceState }) {
      return deviceState?.device?.volume_percent;
    },
    deviceState({ deviceState }) {
      return deviceState;
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
    deviceState(state, { deviceState }) {
      state.deviceState = deviceState;
    }
  },
  actions: {
    async init({ commit, dispatch }, token) {
      try {
        const player = new window.Spotify.Player({
          name: "Gazorpafy Player",
          getOAuthToken: cb => { cb(token); },
        });
        commit({ type: 'player', player });
        playerService.createEventHandlers(player, dispatch, commit);
        await player.connect();
      } catch (err) {
        console.log('failed to initialize player', err);
      }
    },
    async deviceState({ commit }) {
      try {
        const deviceState = await spotifyService.getData('me/player');
        commit({ type: 'deviceState', deviceState });
      } catch (err) {
        console.log('failed to get device state', err);
      }
    },
    async updateState({ commit }, { newState }) {
      const currentState = newState;
      commit({ type: 'updateState', currentState })
    },
    async play({ getters }) {
      const { player } = getters;
      await player.togglePlay();
      // socketService.emit('change');
    },
    async seek({ getters, dispatch }, newPosition) {
      const { deviceId } = getters;
      try {
        await spotifyService.updatePlayer(deviceId, `/seek?position_ms=${newPosition}`);
        dispatch({ type: 'updateState' });
      } catch (err) {
        console.log('couldn\'t seek', err)
      }
    }
  },
}