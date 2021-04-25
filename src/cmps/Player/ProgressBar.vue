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
import { utilService } from '@/services/util.service';
import { socketService } from '@/services/socket.service';

export default {
  data() {
    return {
      barPosition: null,
      barInterval: null,
      isHovered: false,
      isPlayingLocal: false
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
      if (!this.duration && !this.barPosition) return;
      if (!this.isPlaying && !this.playerState.paused) return;
      if (this.isPlaying && !this.isPlayingLocal) {
        console.log('inside if');
        this.barInterval = setInterval(() => {
          this.barPosition = parseInt(this.barPosition) + 1000;
        }, 1000);
        this.isPlayingLocal = true;
      } else {
        console.log('inside else');
        clearInterval(this.barInterval);
        this.barInterval = null;
        this.isPlayingLocal = false;
        if (this.barPosition >= this.duration) this.barPosition = null;
      }
    },
    resetPlayer() {
      console.log('inside resetPlayer');
      this.barPosition = this.position;
      clearInterval(this.barInterval);
      this.barInterval = null;
      this.isPlayingLocal = this.isPlaying;
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
    isPlaying() {
      return this.$store.getters.isPlaying;
    },
    deviceState() {
      return this.$store.getters.deviceState;
    }
  },
  created() {
    socketService.on('change', this.resetPlayer);
    socketService.on('play', this.progressHandler);
    this.barPosition = this.position;
  },
  destroyed() {
    socketService.off('change');
    socketService.off('play');
  },
  watch: {
    position() {
      this.barPosition = this.position;
    },
    isPlaying(to, from) {
      if (to !== from) {
        this.progressHandler();
      }
    },
    playerState(to, from) {
      if (to?.track_window.current_track.id !== from?.track_window.current_track.id) {
        this.progressHandler();
        if (!to?.paused) this.progressHandler();
      }
    }
  }
}
</script>