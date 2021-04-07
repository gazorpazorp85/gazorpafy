<template>
  <div class="playlist-container">
    <div class="flex" v-if="playlist">
      <img :src="playlist.images[0].url" alt="" />
      <div class="playlist-info">
        <div class="uppercase">{{ categoryName }}</div>
        <h1>{{ playlist.name }}</h1>
        <div class="description">{{ playlist.description }}</div>
        <div class="total-songs">{{ formatInfo }}</div>
        <button class="play">play</button>
      </div>
    </div>
    <div :class="`flex uppercase list-header ${playlist.type}`" v-if="playlist">
      <div v-if="playlist.type === 'album'" class="track-number">#</div>
      <div>title</div>
      <div v-if="playlist.type === 'playlist'">artist</div>
      <div v-if="playlist.type === 'playlist'">album</div>
      <span class="material-icons">schedule</span>
    </div>
    <template v-if="tracks && playlist">
      <div v-for="track in tracks" :key="track.id">
        <div :class="`flex tracks ${playlist.type}`">
          <div v-if="playlist.type === 'album'" class="track-number">
            {{ track.number }}
          </div>
          <div>{{ track.name }}</div>
          <div v-if="playlist.type === 'playlist'">
            {{ track.artists[0].name }}
          </div>
          <div v-if="playlist.type === 'playlist'">{{ track.album.name }}</div>
          <div>{{ time(track.duration) }}</div>
        </div>
      </div>
      <div v-if="playlist.type === 'album'" class="flex column copyright-container">
        <small
          v-for="copyright in playlist.copyrights"
          :key="copyright.text"
        >
          {{ copyrightFormat(copyright) }}
        </small>
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
      tracks: null,
    }
  },
  methods: {
    async getPlaylistInfo() {
      try {
        const { id } = this.$route.params;
        if (this.$route.path.includes('playlist')) {
          const playlist = await spotifyService.getDetails(id, 'playlists');
          this.playlist = { ...playlist, type: 'playlist' };
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
        } else {
          const playlist = await spotifyService.getDetails(id, 'albums');
          this.playlist = { ...playlist, type: playlist.album_type };
          this.tracks = playlist?.tracks.items.map(({ duration_ms, explicit, href, id, name, track_number, uri }) => ({
            duration: duration_ms,
            explicit,
            href,
            id,
            name,
            number: track_number,
            uri
          }));
        }
      } catch (err) {
        console.log('failed to get info', err);
      }
    }
  },
  computed: {
    time(unit) {
      return unit => {
        const minutes = (Math.floor(unit / 60000)) + '';
        const seconds = (Math.floor((unit % 60000) / 1000)) + '';
        return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
      }
    },
    formatInfo() {
      const { total, items } = this.playlist.tracks;
      const totalRunningTime = items.reduce((acc, item) => {
        return acc += this.playlist.type === 'playlist' ? item.track.duration_ms : item.duration_ms
      }, 0);
      const minutes = (Math.floor(totalRunningTime / 60000));
      const timeStr = minutes > 60 ? `${Math.floor(minutes / 60)} hr ${Math.floor(minutes % 60)} min` : `${minutes} min`;
      const songsStr = total > 1 ? `${total} songs` : `${total} song`;
      if (this.playlist.type === 'playlist') return `${songsStr}, ${timeStr}`;
      return `${this.playlist.release_date.substring(0, 4)} • ${songsStr}, ${timeStr}`;
    },
    categoryName() {
      if (this.playlist.type === 'album') return 'album';
      if (this.playlist.type === 'playlist' && this.playlist.name.includes('Daily')) return `made for ${this.$store.getters.loggedInUser.fullName.split(' ')[0]}`;
      return 'collaborative playlist';
    },
    copyrightFormat(copyright) {
      return copyright => {
        const symbol = copyright.type === 'C' ? '©' : '℗'
        const formatedCopy = copyright.text.includes(`(${copyright.type})`) ?
          copyright.text.replace(`(${copyright.type})`, symbol) :
          `${symbol} ${copyright.text}`;
        return formatedCopy
      }
    }
  },

  created() {
    this.getPlaylistInfo();
  }
}
</script>

<style>
</style>