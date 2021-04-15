<template>
  <div class="flex player-container">
    <div class="flex column center track-info-container" v-if="playerState">
      <div class="track-name">{{ songInfo.trackName }}</div>
      <div class="artist-name">{{ songInfo.artistName }}</div>
    </div>
    <div class="flex column full center align-center">
      <div class="flex align-center btns-container">
        <span class="material-icons" @click="previousTrack">
          skip_previous
        </span>
        <div class="flex center align-center play-btn-container">
          <span class="material-icons" @click="play">
            {{ playButtonTxt }}
          </span>
        </div>
        <span class="material-icons" @click="nextTrack"> skip_next </span>
      </div>
      <ProgressBar />
    </div>
  </div>
</template>

<script>
import ProgressBar from './Player/ProgressBar';

import { socketService } from '@/services/socket.service';

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
    }
  },
  components: {
    ProgressBar
  },
  created() {
    this.playerInterval = setInterval(this.checkForPlayer, 1000);
  }
}
</script>