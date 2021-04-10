<template>
  <div
    :class="`content main ${type}`"
    @mouseenter="isShownHandler(true)"
    @mouseleave="isShownHandler(false)"
  >
    <div
      class="flex center align-center play-btn-container"
      v-if="isShown && !isAlbum"
      @click="play"
    >
      <span class="material-icons"> play_arrow </span>
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
    <div>{{ track.name }}</div>
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
      console.log(this.track.uri);
    }
  },
  computed: {
    time() {
      const minutes = (Math.floor(this.track.duration / 60000)) + '';
      const seconds = (Math.floor((this.track.duration % 60000) / 1000)) + '';
      return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    },
    isAlbum() {
      return this.type === 'album' || this.type === 'single'
    },
    artist() {
      return this.track.artists[0];
    }
  },
  watch: {
    $route(to, from) {
      this.isShown = false;
    }
  }

}
</script>