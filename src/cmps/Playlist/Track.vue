<template>
  <div
    :class="`content main ${type} ${isPlaying ? 'play' : ''}`"
    @mouseenter="isShownHandler(true)"
    @mouseleave="isShownHandler(false)"
  >
    <div
      class="flex center align-center play-btn-container"
      v-if="!isAlbum && (isShown || isPlaying)"
      @click="play"
    >
      <span class="material-icons" :class="`${isPlaying ? 'play' : ''}`">
        {{ playButtonTxt }}
      </span>
    </div>
    <div v-if="!isShown && isAlbum" class="track-number">
      {{ track.number }}
    </div>
    <div
      class="flex center align-center play-btn-container"
      v-if="isShown && isAlbum"
      @click="play"
    >
      <span class="material-icons"> play_arrow </span>
    </div>
    <div class="flex center align-center track-name">
      <span>{{ track.name }}</span>
      <span v-if="track.explicit">explicit</span>
    </div>
    <router-link
      :to="{ path: `/gazorpafy/artist/${artist.id}` }"
      v-if="!isAlbum"
    >
      {{ artist.name }}
    </router-link>
    <router-link
      :to="{ path: `/gazorpafy/album/${track.album.id}` }"
      v-if="!isAlbum"
    >
      {{ track.album.name }}
    </router-link>
    <div>{{ time }}</div>
  </div>
</template>


<script>

import { spotifyService } from '@/services/spotify.service';
import { utilService } from '@/services/util.service';

export default {
  props: {
    track: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isShown: false
    }
  },
  methods: {
    isShownHandler(value) {
      this.isShown = value;
    },
    play() {
      console.log(this.$store.getters.playerState);
      console.log(this.$store.getters.player);
      const { player, playerState } = this.$store.getters;
      if (playerState.id !== this.track.id) return this.$emit('play', this.track.id);
      player.togglePlay();
    }
  },
  computed: {
    time() {
      return utilService.time(this.track.duration);
    },
    isAlbum() {
      return this.type === 'album' || this.type === 'single';
    },
    artist() {
      return this.track.artists[0];
    },
    isPlaying() {
      const id = this.$store.getters.playerState?.id;
      return this.track.id === id;
    },
    playButtonTxt() {
      if (this.isShown) {
        const { playerState } = this.$store.getters;
        return (this.isPlaying && playerState.playing) ? 'pause' : 'play_arrow';
      } else {
        return 'volume_up_outlined';
      }
    },
  },
  watch: {
    $route(to, from) {
      this.isShown = false;
    },
  }

}
</script>