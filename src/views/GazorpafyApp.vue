<template>
  <section class="gazorpafy-container">
    <SideBar />
    <div class="main-content-container">
      <NavBar @search="search" />
      <!-- <Details v-else-if="artist" :artist="artist" /> -->
      <router-view />
    </div>
    <Player />
  </section>
</template>

<script>
import NavBar from '@/cmps/NavBar';
import Player from '@/cmps/Player';
import SideBar from '@/cmps/SideBar';

import { authService } from '@/services/auth.service';
import { spotifyService } from '@/services/spotify.service';

export default {
  name: 'GazorpafyApp',
  data() {
    return {
      query: '',
      results: null,
      uris: [],
    }
  },
  methods: {
    async search(query) {
      const { token } = this.$store.getters;
      this.results = await spotifyService.query(query, token);
    },
    async setTrack({ track }) {
      this.uris.push(track.uri);
      await this.playTrack();
    },
    async setAlbum(album) {
      const { token } = this.$store.getters;
      const { items } = await spotifyService.getAlbumTracks(album.id, token);
      this.uris = items.map(item => item.uri);
      await this.playTrack();
    },
    async playTrack() {
      try {
        const { deviceId, token } = this.$store.getters;
        await spotifyService.playTrack(this.uris, deviceId, token);
      } catch (err) {
        console.log('failed to play track', err);
      }
    },
    async getInfo(item) {
      try {
        const { token } = this.$store.getters;
        if (item.type === 'playlist') {
          const { items } = await spotifyService.get(item.tracks.href, token);
          this.playlist = item;
          this.tracks = items.map(({ track }) => ({
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
        } else {
          const { items } = await spotifyService.get(`${item.href}/albums`, token);
          const { artists } = await spotifyService.get(`${item.href}/related-artists`, token);
          const { tracks } = await spotifyService.get(`${item.href}/top-tracks?market=us`, token);
          this.artist = { albums: items, artists, tracks }
        }
      } catch (err) {
        console.log('failed to get info', err);
      }
    },
  },
  created() {
    this.$store.dispatch('getUserData');
  },
  components: {
    NavBar,
    Player,
    SideBar,
  }
}
</script>