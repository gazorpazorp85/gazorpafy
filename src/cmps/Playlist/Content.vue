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
      @play="play"
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
  methods: {
    async play(id) {
      // console.log(id);
      try {
        const idx = this.tracks.findIndex(track => track.id === id);
        const tracks = JSON.parse(JSON.stringify(this.tracks.slice(idx)));
        const uris = tracks.map(({ uri }) => uri);
        // console.log('uris', uris);
        const { deviceId, token } = this.$store.getters;
        await spotifyService.playTrack(uris, deviceId, token);
      } catch (err) {
        console.log('failed to play track', err);
      }
    }
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