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
            :max="trackDuration"
            v-model="position"
            @click="seek"
          />
          <div
            :style="{ width: progressBar + '%', background: hoverHandler }"
            class="progress-bar"
          ></div>
        </div>
        <div>{{ time(trackDuration) }}</div>
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
      playerCheckInterval: null,
      position: 0,
      seekPosition: 0,
      positionInterval: null,
      trackDuration: null,
      isHovered: false
    }
  },
  methods: {
    checkForPlayer() {
      if (window.Spotify) {
        this.$store.dispatch('init', this.$store.getters.token);
        clearInterval(this.playerCheckInterval);
        this.updateTrackInfo();
      }
    },
    play() {
      const { player, playerState } = this.$store.getters;
      console.log('player', player);
      player.togglePlay();
      if (this.positionInterval) clearInterval(this.positionInterval);
      if (!playerState.playing) {
        this.positionInterval = setInterval(() => {
          this.position += 1000;
        }, 1000);
      } else {
        clearInterval(this.positionInterval);
      }
    },
    async seek() {
      try {
        const { deviceId } = this.$store.getters;
        await spotifyService.seek(this.position, deviceId);
      } catch (err) {
        console.log('couldn\'t seek', err)
      }
    },
    previousTrack() {
      this.$store.getters.player.previousTrack();
    },
    nextTrack() {
      this.$store.getters.player.nextTrack();
    },
    updateTrackInfo() {
      if (!this.$store.getters.playerState) return;
      const { duration, position } = this.$store.getters.playerState;
      this.trackDuration = duration;
      this.position = position;
    },
    hover(value) {
      this.isHovered = value;
    }
  },
  computed: {
    playButtonTxt() {
      return this.$store.getters.playerState?.playing ? 'pause' : 'play_arrow';
    },
    time(unit) {
      return unit => utilService.time(unit);
    },
    playerState() {
      return this.$store.getters.playerState;
    },
    progressBar() {
      return Math.floor((this.position / this.trackDuration) * 100) || 0;
    },
    hoverHandler() {
      return this.isHovered ? '#1db954' : '#b3b3b3';
    }
  },
  created() {
    this.playerCheckInterval = setInterval(this.checkForPlayer, 1000);
  },
  watch: {
    playerState(to, from) {
      this.updateTrackInfo();
    }
  }
}
</script>