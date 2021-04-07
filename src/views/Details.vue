<template>
  <div class="flex column details-container">
    <template v-if="artist">
      <Header :artist="artist.artist" />
      <div class="flex">
        <div class="flex column artist-hero-left">
          <LatestRelease :album="latestRelease" />
          <div class="flex column">
            <div class="capitalize list-title">popular</div>
            <div
              class="flex track-list"
              v-for="track in tracksToShow"
              :key="track.id"
            >
              <img :src="track.album.images[2].url" alt="" />
              <div class="track-name">{{ track.name }}</div>
              <div>{{ time(track.duration_ms) }}</div>
            </div>
          </div>
        </div>
        <div class="flex column">
          <div class="capitalize list-title">fans also like</div>
          <div
            class="flex artist-container"
            v-for="artist in artistsToShow"
            :key="artist.id"
          >
            <img :src="artist.images[2].url" alt="" />
            <div>{{ artist.name }}</div>
          </div>
        </div>
      </div>
      <button @click="toggleShowMore">{{ buttonTxt }}</button>
      <div
        v-for="key in Object.keys(albumsMap)"
        :key="key"
        class="flex column cards-container"
      >
        <div class="flex column center list-header">
          <div class="list-title">{{ formatKey(key) }}</div>
          <List :items="albumsMap[key]" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>

import Header from '@/cmps/Details/Header';
import LatestRelease from '@/cmps/Details/LatestRelease';
import List from '../cmps/ListContainer/List';

import { spotifyService } from '@/services/spotify.service';

export default {
  data() {
    return {
      artist: null,
      isShowMore: false
    }
  },
  methods: {
    async getArtistDetails() {
      try {
        const { token } = this.$store.getters;
        const { id } = this.$route.params;
        const artist = await spotifyService.getDetails(id, 'artists');
        const { items } = await spotifyService.get(`${artist.href}/albums`, token);
        const { artists } = await spotifyService.get(`${artist.href}/related-artists`, token);
        const { tracks } = await spotifyService.get(`${artist.href}/top-tracks?market=us`, token);
        this.artist = { albums: items, artist, artists, tracks }
      } catch (err) {
        console.log('failed to get info', err);
      }
    },
    toggleShowMore() {
      this.isShowMore = !this.isShowMore;
    }
  },
  computed: {
    artistsToShow() {
      const idx = this.isShowMore ? 10 : 4;
      return JSON.parse(JSON.stringify(this.artist.artists)).slice(0, idx);
    },
    tracksToShow() {
      const idx = this.isShowMore ? 10 : 5;
      return JSON.parse(JSON.stringify(this.artist.tracks)).slice(0, idx);
    },
    time(unit) {
      return unit => {
        const minutes = (Math.floor(unit / 60000)) + '';
        const seconds = (Math.floor((unit % 60000) / 1000)) + '';
        return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
      }
    },
    buttonTxt() {
      return this.isShowMore ? 'show only 5 songs' : 'show 5 more';
    },
    latestRelease() {
      const { albums } = JSON.parse(JSON.stringify(this.artist));
      const sortedAlbums = albums.sort((albumA, albumB) => {
        return albumA.release_date > albumB.release_date ? -1 : 1;
      });
      return sortedAlbums[0];
    },
    albumsMap() {
      const { albums } = JSON.parse(JSON.stringify(this.artist));
      const editedAlbums = albums.map(albums => ({ ...albums, type: 'album' }))
      const albumGroups = [...new Set(editedAlbums.map(album => album.album_group))];
      const albumsMap = albumGroups.reduce((acc, group) => {
        return { ...acc, [group]: albums.filter(album => album.album_group === group) };
      }, {});
      return albumsMap;
    },
    formatKey(key) {
      return key => key.replaceAll('_', ' ');
    }
  },
  components: {
    Header,
    LatestRelease,
    List
  },
  created() {
    this.getArtistDetails();
  }
}
</script>

<style>
</style>