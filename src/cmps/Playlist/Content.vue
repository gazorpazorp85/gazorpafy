<template>
  <div v-if="playlist">
    <div :class="`content header ${playlist.type}`">
      <div v-if="isAlbum" class="track-number">#</div>
      <div>title</div>
      <div v-if="!isAlbum">artist</div>
      <div v-if="!isAlbum">album</div>
      <span class="material-icons">schedule</span>
    </div>
    <div
      v-for="track in tracks"
      :key="track.id"
      :class="`content main ${playlist.type}`"
    >
      <div v-if="isAlbum" class="track-number">
        {{ track.number }}
      </div>
      <div>{{ track.name }}</div>
      <router-link
        :to="{ path: `/gazorpafy/artist/${track.artists[0].id}` }"
        v-if="!isAlbum"
      >
        {{ track.artists[0].name }}
      </router-link>
      <router-link
        :to="{ path: `/gazorpafy/album/${track.album.id}` }"
        v-if="!isAlbum"
      >
        {{ track.album.name }}
      </router-link>
      <div>{{ time(track.duration) }}</div>
    </div>
    <div v-if="isAlbum" class="flex column copyright-container">
      <Copyright v-for="(copyright, idx) in playlist.copyrights" :key="idx" :copyright="copyright" />
    </div>
  </div>
</template>

<script>

import Copyright from './Copyright';

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
    time(unit) {
      return unit => {
        const minutes = (Math.floor(unit / 60000)) + '';
        const seconds = (Math.floor((unit % 60000) / 1000)) + '';
        return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
      }
    },
    isAlbum() {
      return this.playlist.type === 'album' || this.playlist.type === 'single'
    },
  },
  components: {
    Copyright
  }
}
</script>