<template>
  <div
    :class="`content main ${type} ${isPlaying ? 'play' : ''} ${
      !track.isPlayable ? 'unavailable' : ''
    }`"
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
    <div
      v-if="isAlbum && !isShown && !isPlaying"
      class="flex align-center track-number"
    >
      {{ track.number }}
    </div>
    <div
      class="flex center align-center play-btn-container"
      v-if="isAlbum && (isShown || isPlaying)"
      @click="play"
    >
      <span class="material-icons" :class="`${isPlaying ? 'play' : ''}`">
        {{ playButtonTxt }}
      </span>
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

import { playerService } from '@/services/player.service';
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
      if (!this.track.isPlayable) return;
      this.isShown = value;
    },
    play() {
      if (!this.track.isPlayable) return;
      const { getters, dispatch } = this.$store;
      const { playerState } = getters;
      const { id } = playerState?.track_window.current_track;
      if (id === this.track.id) return dispatch('play');
      playerService.playHandler(dispatch, getters, [this.track.uri]);
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
      const id = this.$store.getters.songInfo?.id;
      return this.track.id === id;
    },
    playButtonTxt() {
      if (this.isShown) {
        const { playerState } = this.$store.getters;
        return (this.isPlaying && !playerState.paused) ? 'pause' : 'play_arrow';
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