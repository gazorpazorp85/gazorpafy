<template>
  <div class="playlist-container main-container">
    <div class="flex" v-if="playlist">
      <img :src="playlist.images[0].url" alt="" />
      <div class="playlist-info">
        <div class="uppercase">{{ categoryName }}</div>
        <h1>{{ playlist.name }}</h1>
        <div v-if="playlist.artists" class="artist-link-container">
          By
          <router-link
            :to="{ path: `/gazorpafy/artist/${playlist.artists[0].id}` }"
          >
            {{ playlist.artists[0].name }}
          </router-link>
        </div>
        <div v-else class="description">{{ playlist.description }}</div>
        <div class="total-songs">{{ formatInfo }}</div>
        <button class="play">play</button>
      </div>
    </div>
    <div v-if="playlist">
      <div :class="`content header ${playlist.type}`">
        <div
          v-if="playlist.type === 'album' || playlist.type === 'single'"
          class="track-number"
        >
          #
        </div>
        <div>title</div>
        <div v-if="playlist.type === 'playlist'">artist</div>
        <div v-if="playlist.type === 'playlist'">album</div>
        <span class="material-icons">schedule</span>
      </div>
      <div
        v-for="track in tracks"
        :key="track.id"
        :class="`content main ${playlist.type}`"
      >
        <div
          v-if="playlist.type === 'album' || playlist.type === 'single'"
          class="track-number"
        >
          {{ track.number }}
        </div>
        <div>{{ track.name }}</div>
        <router-link
          :to="{ path: `/gazorpafy/artist/${track.artists[0].id}` }"
          v-if="playlist.type === 'playlist'"
        >
          {{ track.artists[0].name }}
        </router-link>
        <router-link
          :to="{ path: `/gazorpafy/album/${track.album.id}` }"
          v-if="playlist.type === 'playlist'"
        >
          {{ track.album.name }}
        </router-link>
        <div>{{ time(track.duration) }}</div>
      </div>
      <div
        v-if="playlist.type === 'album' || playlist.type === 'single'"
        class="flex column copyright-container"
      >
        <small v-for="(copyright, idx) in playlist.copyrights" :key="idx">
          {{ copyrightFormat(copyright) }}
        </small>
      </div>
    </div>
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
        console.log('params', this.$route.params);
        const { id } = this.$route.params;
        if (this.$route.path.includes('playlist')) {
          const playlist = await spotifyService.getDetails(id, 'playlists');
          this.playlist = { ...playlist, type: 'playlist' };
          this.tracks = playlist?.tracks.items.map(({ track }) => ({
            album: {
              name: track.album.name,
              id: track.album.id,
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
      if (this.playlist.type === 'single') return 'ep';
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
  },
  watch: {
    $route(to, from) {
      if (to.params.id !== from.params.id) this.getPlaylistInfo();
    }
  }
}
</script>