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
      <div
        class="flex align-center progress-bar-container"
        @mouseenter="hover(true)"
        @mouseleave="hover(false)"
      >
        <div>{{ time(position) }}</div>
        <div class="slider-container">
          <input
            class="slider"
            type="range"
            min="0"
            :max="duration"
            v-model="playerPosition"
            @click="seek"
          />
          <div
            :style="{ width: progressBar + '%', background: hoverHandler }"
            class="progress-bar"
          ></div>
        </div>
        <div>{{ time(duration) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { spotifyService } from '@/services/spotify.service';
import { utilService } from '@/services/util.service';

export default {
  name: 'player',
  data() {
    return {
      playerInterval: null,
      playerPosition: 0,
      isHovered: false
    }
  },
  methods: {
    checkForPlayer() {
      if (window.Spotify) {
        this.$store.dispatch('init', this.$store.getters.token);
        clearInterval(this.playerInterval);
        this.updateTrackInfo();
      }
    },
    play() {
      this.$store.dispatch('play');
    },
    async seek() {
      this.$store.dispatch('seek', this.playerPosition);
      // try {
      //   const { deviceId } = this.$store.getters;
      //   await spotifyService.transferPlayback(deviceId, `/seek?position_ms=${this.playerPosition}`);
      // } catch (err) {
      //   console.log('couldn\'t seek', err)
      // }
    },
    previousTrack() {
      this.$store.getters.player.previousTrack();
    },
    nextTrack() {
      this.$store.getters.player.nextTrack();
    },
    updateTrackInfo() {
      if (!this.position) return;
      this.playerPosition = this.position;
    },
    hover(value) {
      this.isHovered = value;
    }
  },
  computed: {
    playButtonTxt() {
      return this.playerState?.playing ? 'pause' : 'play_arrow';
    },
    time(unit) {
      if (!unit) return '00:00';
      return unit => utilService.time(unit);
    },
    playerState() {
      return this.$store.getters.playerState;
    },
    progressBar() {
      if (!this.playerState) return 0;
      return ((this.position / this.duration) * 100).toFixed(4);
    },
    hoverHandler() {
      return this.isHovered ? '#1db954' : '#b3b3b3';
    },
    position() {
      return this.$store.getters.position;
    },
    duration() {
      return this.$store.getters.duration;
    }
  },
  created() {
    this.playerInterval = setInterval(this.checkForPlayer, 1000);
  },
  watch: {
    'position': function (to, from) {
      this.updateTrackInfo();
      console.log(window.Spotify)
    }
  }
}
</script>