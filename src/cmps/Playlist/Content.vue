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
    <Copyrights :copyrights="playlist.copyrights" v-if="isAlbum"/>
  </div>
</template>

<script>

import Copyrights from './Copyrights';
import Track from './Track';

import { spotifyService } from '@/services/spotify.service';

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
    Copyrights,
    Track
  }
}
</script>