<template>
  <div
    class="flex align-center volume-container"
    @mouseenter="hover(true)"
    @mouseleave="hover(false)"
  >
    <span class="material-icons">volume_up_outlined</span>
    <div class="slider-container">
      <input
        class="slider"
        type="range"
        min="0"
        max="100"
        v-model="barPosition"
        @click="changeVolume"
      />
      <div
        :style="{ width: barPosition + '%', background: hoverHandler }"
        class="progress-bar"
      ></div>
    </div>
  </div>
</template>

<script>
import { spotifyService } from '@/services/spotify.service';

export default {
  data() {
    return {
      barPosition: 0,
      isHovered: false
    }
  },
  methods: {
    hover(value) {
      this.isHovered = value;
    },
    async changeVolume() {
      try {
        const { deviceId } = this.$store.getters;
        await spotifyService.updatePlayer(deviceId, `/volume?volume_percent=${this.barPosition}`);
      } catch (err) {
        console.log('failed to update player volume', err);
      }
    }
  },
  computed: {
    hoverHandler() {
      return this.isHovered ? '#1db954' : '#b3b3b3';
    },
    volume() {
      return this.$store.getters.volume;
    }
  },
  watch: {
    volume(to, from) {
      this.barPosition = this.volume;
    }
  }
}
</script>