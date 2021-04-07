<template>
  <div class="flex player-container">
    <div class="flex column center track-info-container" v-if="playerState">
      <div class="track-name">{{ playerState.trackName }}</div>
      <div class="artist-name">{{ playerState.artistName }}</div>
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
      <div class="flex progress-bar-container">
        <div :style="{ margin: '0 10px' }">{{ time(position) }}</div>
        <div>{{ time(trackDuration) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { spotifyService } from '@/services/spotify.service';

export default {
  name: 'player',
  data() {
    return {
      playerCheckInterval: null,
      position: null,
      positionInterval: null,
      trackDuration: null,
    }
  },
  methods: {
    checkForPlayer() {
      if (window.Spotify) {
        this.$store.dispatch('init', this.$store.getters.token);
        clearInterval(this.playerCheckInterval);
      }
    },
    play() {
      const { player, playerState } = this.$store.getters;
      this.trackDuration = playerState.duration;
      player.togglePlay();
      if (this.positionInterval) clearInterval(this.positionInterval);
      if (!playerState.playing) {
        this.position = playerState.position;
        this.positionInterval = setInterval(() => {
          this.position += 1000
        }, 1000);
      } else {
        clearInterval(this.positionInterval);
      }
    },
    previousTrack() {
      this.$store.getters.player.previousTrack();
    },
    nextTrack() {
      this.$store.getters.player.nextTrack();
    },
  },
  computed: {
    playButtonTxt() {
      return this.$store.getters.playerState?.playing ? 'pause' : 'play_arrow';
    },
    time(unit) {
      return unit => {
        const minutes = (Math.floor(unit / 60000)) + '';
        const seconds = (Math.floor((unit % 60000) / 1000)) + '';
        return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
      }
    },
    playerState() {
      return this.$store.getters.playerState;
    },
  },
  created() {
    this.playerCheckInterval = setInterval(this.checkForPlayer, 1000);
  },
}
</script>