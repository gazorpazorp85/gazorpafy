import { playerService } from '../../services/player.service';
import { spotifyService } from '../../services/spotify.service';

export const playerStore = {
  state: {
    player: null,
    playerState: null,
    deviceId: null,
    position: 0
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
    position({ position }) {
      return position;
    },
    duration({ playerState }) {
      return playerState?.duration;
    },
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
        state.position = position;
      }
    },
  },
  actions: {
    init({ commit, dispatch }, token) {
      const player = new window.Spotify.Player({
        name: "Gazorpafy Player",
        getOAuthToken: cb => { cb(token); },
      });
      commit({ type: 'player', player });
      // const cb = (updatedState) => 
      playerService.createEventHandlers(player, dispatch, commit);
      player.connect();
    },
    async updateState({ commit }) {
      const currentState = await this.getters.player.getCurrentState();
      commit({ type: 'updateState', currentState })
    },
    play({ commit, getters }) {
      const { player, playerState, position } = getters;
      playerService.play(playerState, position, (newPosition) => {
        commit({ type: 'position', newPosition });
      });
      player.togglePlay();
    },
    async seek({ commit, getters }, newPosition) {
      const { deviceId } = getters;
      try {
        commit({ type: 'position', newPosition });
        await spotifyService.transferPlayback(deviceId, `/seek?position_ms=${newPosition}`);
      } catch (err) {
        console.log('couldn\'t seek', err)
      }
    }
  },
}