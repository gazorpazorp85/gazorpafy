<template>
  <div class="flex column details-container">
    <div class="main-container w100">
      <template v-if="artist">
        <Header :artist="artist.artist" />
        <div class="flex">
          <div class="flex column artist-hero-left">
            <LatestRelease :album="latestRelease" />
            <div class="flex column">
              <div class="capitalize title">popular</div>
              <div
                class="flex track-list"
                v-for="(track, idx) in tracksToShow"
                :key="track.id"
              >
                <img :src="track.album.images[2].url" alt="" />
                <div>{{ idx + 1 }}</div>
                <div class="track-name">{{ track.name }}</div>
                <div>{{ time(track.duration_ms) }}</div>
              </div>
            </div>
          </div>
          <div class="flex column fans-like-container">
            <div class="capitalize title">fans also like</div>
            <div
              class="flex artist-container"
              v-for="artist in artistsToShow"
              :key="artist.id"
            >
              <img v-if="artist.images[2]" :src="artist.images[2].url" alt="" />
              <div v-else class="flex center align-center artist-icon">
                <span class="material-icons"> person_outline </span>
              </div>
              <div>{{ artist.name }}</div>
            </div>
          </div>
        </div>
        <button @click="toggleShowMore">{{ buttonTxt }}</button>
        <div
          v-for="key in Object.keys(albumsMap)"
          :key="key"
          class="flex column preview-container"
        >
          <div class="list-header title">{{ formatKey(key) }}</div>
          <List :items="albumsMap[key]" type="album" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>

import Header from '@/cmps/Details/Header';
import LatestRelease from '@/cmps/Details/LatestRelease';
import List from '@/cmps/List';

import { spotifyService } from '@/services/spotify.service';
import { utilService } from '@/services/util.service';

export default {
  data() {
    return {
      artist: null,
      idx: 0,
      isShowMore: false
    }
  },
  methods: {
    async getArtistDetails() {
      try {
        const { token } = this.$store.getters;
        const { id } = this.$route.params;
        const artist = await spotifyService.getDetails(id, 'artists');
        const { items } = await spotifyService.get(`${artist.href}/albums?limit=50`, token);
        const albums = items.filter(item => item.available_markets.includes('IL'));
        const { artists } = await spotifyService.get(`${artist.href}/related-artists`, token);
        const { tracks } = await spotifyService.get(`${artist.href}/top-tracks?market=IL`, token);
        this.artist = { albums, artist, artists, tracks }
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
      console.log(JSON.parse(JSON.stringify(this.artist.artists)).slice(0, idx))
      const idx = this.isShowMore ? 10 : 4;
      return JSON.parse(JSON.stringify(this.artist.artists)).slice(0, idx);
    },
    tracksToShow() {
      const idx = this.isShowMore ? 10 : 5;
      return JSON.parse(JSON.stringify(this.artist.tracks)).slice(0, idx);
    },
    time(unit) {
      return unit => utilService.time(unit);
    },
    buttonTxt() {
      return this.isShowMore ? 'show only 5 songs' : 'show 5 more';
    },
    latestRelease() {
      const albums = this.artist.albums.filter(album => album.album_group !== 'appears_on');
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
      return key => {
        if (key === 'album') return 'Albums';
        if (key === 'single') return 'Singles and EPs';
        if (key === 'appears_on') return 'Appears On';
      };
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