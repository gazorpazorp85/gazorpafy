<template>
  <div
    class="flex align-center progress-bar-container"
    @mouseenter="hover(true)"
    @mouseleave="hover(false)"
  >
    <div v-if="position">{{ time(barPosition) }}</div>
    <div class="slider-container">
      <input
        class="slider"
        type="range"
        min="0"
        :max="duration"
        v-model="barPosition"
        @click="seek"
      />
      <div
        :style="{ width: progressBar + '%', background: hoverHandler }"
        class="progress-bar"
      ></div>
    </div>
    <div v-if="duration">{{ time(duration) }}</div>
  </div>
</template>

<script>
import { Observable } from 'rxjs';

import { utilService } from '@/services/util.service';
import { socketService } from '@/services/socket.service';

export default {
  data() {
    return {
      barPosition: 0,
      barInterval: null,
      isHovered: false,
      isPlaying: false
    }
  },
  methods: {
    hover(value) {
      this.isHovered = value;
    },
    seek() {
      this.$store.dispatch('seek', this.barPosition);
    },
    progressHandler() {
      this.isPlaying = true;
      if (!this.barInterval && this.isPlaying) {
        this.barInterval = setInterval(() => {
          this.barPosition = parseInt(this.barPosition) + 1000;
        }, 1000);
      } else {
        clearInterval(this.barInterval);
        this.barInterval = null;
        this.isPlaying = false;
      }
    },
    resetPlayer() {
      this.barPosition = this.position;
      clearInterval(this.barInterval);
      this.barInterval = null;
      this.isPlaying = false;
    }
  },
  computed: {
    time(unit) {
      if (!unit) return '00:00';
      return unit => utilService.time(unit);
    },
    progressBar() {
      if (!this.playerState) return 0;
      return ((this.barPosition / this.duration) * 100).toFixed(4);
    },
    hoverHandler() {
      return this.isHovered ? '#1db954' : '#b3b3b3';
    },
    position() {
      return this.$store.getters.position;
    },
    duration() {
      return this.$store.getters.duration;
    },
    playerState() {
      return this.$store.getters.playerState;
    },
  },
  created() {
    socketService.on('play', this.progressHandler);
    socketService.on('change', this.resetPlayer);
    this.barPosition = this.position;
  },
  destroyed() {
    socketService.off('play');
    socketService.off('change');
  },
  watch: {
    position() {
      this.barPosition = this.position;
    },
    'playerState.track_window.current_track': function (to, from) {
      if (to?.uid !== from?.uid && !this.isPlaying) {
        this.resetPlayer();
      }
    },
  }
}
</script>