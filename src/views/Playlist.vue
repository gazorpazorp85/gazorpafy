<template>
  <div class="playlist-container">
    <div class="main-container">
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
          <button @click="play" class="play">{{ playButtonTxt }}</button>
        </div>
      </div>
      <Content
        :playlist="playlist"
        :tracks="tracks"
        v-if="playlist && tracks"
      />
    </div>
  </div>
</template>

<script>

import Content from '@/cmps/Playlist/Content'

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
        // console.log('params', this.$route.params);
        const { id } = this.$route.params;
        if (this.$route.path.includes('playlist')) {
          const playlist = await spotifyService.getDetails(id, 'playlists');
          // console.log('playlist', playlist);
          this.playlist = { ...playlist, type: 'playlist' };
          this.tracks = playlist.tracks.items.map(({ track }) => ({
            album: {
              name: track.album.name,
              id: track.album.id,
            },
            artists: track.artists,
            duration: track.duration_ms,
            explicit: track.explicit,
            href: track.href,
            id: track.id,
            name: track.name,
            uri: track.uri
          }));
        } else {
          const playlist = await spotifyService.getDetails(id, 'albums');
          this.playlist = { ...playlist, type: playlist.album_type };
          this.tracks = playlist.tracks.items.map(({ duration_ms, explicit, href, id, name, track_number, uri }) => ({
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
    },
    async play() {
      try {
        const { deviceId, token } = this.$store.getters;
        const uris = this.playlist.tracks.items.map(item => item.track.uri);
        await spotifyService.playTrack(uris, deviceId, token);
      } catch (err) {
        console.log('failed to play track', err);
      }
    }
  },
  computed: {
    formatInfo() {
      const { release_date, tracks, type } = this.playlist;
      const { total, items } = tracks;
      const totalRunningTime = items.reduce((acc, item) => {
        const unit = type === 'playlist' ? item.track.duration_ms : item.duration_ms;
        return acc += unit;
      }, 0);
      const minutes = (Math.floor(totalRunningTime / 60000));
      const timeStr = minutes > 60 ? `${Math.floor(minutes / 60)} hr ${Math.floor(minutes % 60)} min` : `${minutes} min`;
      const songsStr = total > 1 ? `${total} songs` : `${total} song`;
      if (type === 'playlist') return `${songsStr}, ${timeStr}`;
      return `${release_date.substring(0, 4)} • ${songsStr}, ${timeStr}`;
    },
    categoryName() {
      const { name, type } = this.playlist;
      if (type === 'album') return 'album';
      if (type === 'single') return 'ep';
      const firstName = this.$store.getters.loggedInUser.fullName.split(' ')[0];
      if (type === 'playlist' && name.includes('Daily')) return `made for ${firstName}`;
      return 'collaborative playlist';
    },
    playButtonTxt() {
      return this.$store.getters.playerState?.playing ? 'pause' : 'play';
    },
  },
  components: {
    Content
  },
  created() {
    this.getPlaylistInfo();
  },
  watch: {
    $route(to, from) {
      this.getPlaylistInfo();
    }
  }
}
</script>