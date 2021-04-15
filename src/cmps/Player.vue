<template>
  <div class="flex player-container">
    <div class="flex column center track-info-container" v-if="playerState">
      <div class="track-name">{{ songInfo.trackName }}</div>
      <div class="artist-name">{{ songInfo.artistName }}</div>
    </div>
    <div class="flex column full center align-center">
      <div class="flex align-center btns-container">
        <span
          class="material-icons"
          :class="shuffleState ? 'active' : ''"
          @click="shuffle"
        >
          shuffle
        </span>
        <span class="material-icons" @click="previousTrack">
          skip_previous
        </span>
        <div class="flex center align-center play-btn-container">
          <span class="material-icons" @click="play">
            {{ playButtonTxt }}
          </span>
        </div>
        <span class="material-icons" @click="nextTrack"> skip_next </span>
        <span
          class="material-icons"
          :class="repeatState !== 'off' ? 'active' : ''"
          @click="repeat"
        >
          repeat
        </span>
      </div>
      <ProgressBar />
    </div>
    <Volume />
  </div>
</template>

<script>
import ProgressBar from './Player/ProgressBar';
import Volume from './Player/Volume';

import { socketService } from '@/services/socket.service';
import { spotifyService } from '@/services/spotify.service';

export default {
  name: 'player',
  data() {
    return {
      playerInterval: null,
    }
  },
  methods: {
    checkForPlayer() {
      if (window.Spotify) {
        this.$store.dispatch('init', this.$store.getters.token);
        clearInterval(this.playerInterval);
      }
    },
    play() {
      this.$store.dispatch('play');
      socketService.emit('play');
    },
    previousTrack() {
      this.$store.getters.player.previousTrack();
    },
    nextTrack() {
      this.$store.getters.player.nextTrack();
    },
    async shuffle() {
      try {
        const { deviceId } = this.$store.getters;
        await spotifyService.updatePlayer(deviceId, `/shuffle?state=${!this.shuffleState}`);
      } catch (err) {
        console.log('failed to update shuffle state', err);
      }
    },
    async repeat() {
      try {
        console.log('repeatState', this.repeatState);
        const repeatStates = ['off', 'context', 'track'];
        const idx = repeatStates.findIndex(state => state === this.repeatState);
        const nextState = repeatStates[idx === repeatStates.length - 1 ? 0 : idx + 1];
        console.log('nextState', nextState);
        const { deviceId } = this.$store.getters;
        console.log(`/repeat?state=${nextState}`);
        await spotifyService.updatePlayer(deviceId, `/repeat?state=${nextState}`);
      } catch (err) {
        console.log('failed to update shuffle state', err);
      }
    }
  },
  computed: {
    playButtonTxt() {
      return this.playerState?.paused ? 'play_arrow' : 'pause';
    },
    player() {
      return this.$store.getters.player;
    },
    playerState() {
      return this.$store.getters.playerState;
    },
    position() {
      return this.$store.getters.position;
    },
    duration() {
      return this.$store.getters.duration;
    },
    songInfo() {
      return this.$store.getters.songInfo;
    },
    playerPositionProp() {
      return this.playerPosition;
    },
    shuffleState() {
      return this.$store.getters.shuffleState;
    },
    repeatState() {
      return this.$store.getters.repeatState;
    }
  },
  components: {
    ProgressBar,
    Volume
  },
  created() {
    this.playerInterval = setInterval(this.checkForPlayer, 1000);
  }
}
</script>