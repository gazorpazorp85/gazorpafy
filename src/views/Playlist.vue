<template>
  <div class="playlist-container">
    <div class="flex" v-if="playlist">
      <img :src="playlist.images[0].url" alt="" />
      <div class="playlist-info">
        <h1>{{ playlist.name }}</h1>
        <div class="description">{{ playlist.description }}</div>
        <div class="total-songs">{{ playlist.tracks.total }} songs</div>
        <button class="play">play</button>
      </div>
    </div>
    <div class="flex uppercase list-header">
      <div>title</div>
      <div>artist</div>
      <div>album</div>
      <span class="material-icons">schedule</span>
    </div>
    <template v-if="tracks">
      <div v-for="track in tracks" :key="track.id">
        <div class="flex tracks">
          <div>{{ track.name }}</div>
          <div>{{ track.artists[0].name }}</div>
          <div>{{ track.album.name }}</div>
          <div>{{ time(track.duration) }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>

import { spotifyService } from '@/services/spotify.service';

export default {
  data() {
    return {
      playlist: null,
      tracks: null
    }
  },
  methods: {
    async getPlaylistInfo() {
      try {
        const { id } = this.$route.params;
        const playlist = await spotifyService.getDetails(id, 'playlists');
        this.playlist = playlist;
        this.tracks = playlist?.tracks.items.map(({ track }) => ({
          album: {
            name: track.album.name,
            href: track.album.href
          },
          artists: track.artists,
          duration: track.duration_ms,
          href: track.href,
          id: track.id,
          name: track.name,
          uri: track.uri
        }));
      } catch (err) {
        console.log('failed to get info', err);
      }
    }
  },
  computed: {
    time(unit) {
      return unit => {
        const minutes = Math.floor(unit / 60000);
        const seconds = Math.floor((unit % 60000) / 1000);
        return `${minutes <= 0 ? `00` : minutes < 10 ? `0${minutes}` : `${minutes}`}:${seconds < 10 ? `0${seconds}` : `${seconds}`}`;
      }
    },
  },
  created() {
    this.getPlaylistInfo();
  }
}
</script>

<style>
</style>