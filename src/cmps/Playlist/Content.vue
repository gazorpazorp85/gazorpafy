<template>
  <div v-if="playlist">
    <div :class="`content header ${playlist.type}`">
      <div v-if="isAlbum" class="track-number">#</div>
      <div>title</div>
      <div v-if="!isAlbum">artist</div>
      <div v-if="!isAlbum">album</div>
      <span class="material-icons">schedule</span>
    </div>
    <Track
      v-for="track in tracks"
      :key="track.id"
      :type="playlist.type"
      :track="track"
    />
    <div v-if="isAlbum" class="flex column copyright-container">
      <Copyright
        v-for="(copyright, idx) in playlist.copyrights"
        :key="idx"
        :copyright="copyright"
      />
    </div>
  </div>
</template>

<script>

import Copyright from './Copyright';
import Track from './Track';

export default {
  props: {
    playlist: {
      type: Object,
      required: true
    },
    tracks: {
      type: Array,
      required: true
    },
  },
  computed: {
    isAlbum() {
      const { type } = this.playlist;
      return type === 'album' || type === 'single'
    },
  },
  components: {
    Copyright,
    Track
  }
}
</script>