<template>
  <div>
    <div class="flex">
      <div class="flex column artist-hero-left">
        <LatestRelease :album="latestRelease" />
        <div class="flex column">
          <div class="capitalize title">popular</div>
          <div
            class="flex track-list"
            v-for="(track, idx) in itemsToShow(5)"
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
        <div class="capitalize pointer title" @click="go">fans also like</div>
        <router-link
          class="flex artist-container"
          v-for="artist in itemsToShow(4)"
          :key="artist.id"
          :to="`/gazorpafy/artist/${artist.id}`"
        >
          <img v-if="artist.images[2]" :src="artist.images[2].url" alt="" />
          <div v-else class="flex center align-center artist-icon">
            <span class="material-icons"> person_outline </span>
          </div>
          <div>{{ artist.name }}</div>
        </router-link>
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
  </div>
</template>

<script>
import LatestRelease from '@/cmps/Details/LatestRelease';
import List from '@/cmps/List';

import { spotifyService } from '@/services/spotify.service';
import { socketService } from '@/services/socket.service';
import { utilService } from '@/services/util.service';

export default {
  props: {
    artist: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      idx: 0,
      isShowMore: false
    }
  },
  methods: {
    toggleShowMore() {
      this.isShowMore = !this.isShowMore;
    },
    go() {
      socketService.emit('go', 'fans');
    }
  },
  computed: {
    itemsToShow(diff) {
      return diff => {
        const idx = this.isShowMore ? 10 : diff;
        const items = _.cloneDeep(diff === 4 ? this.artist.artists : this.artist.tracks);
        return items.slice(0, idx);
      }
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
      const { albums } = _.cloneDeep(this.artist);
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
    LatestRelease,
    List
  },
}
</script>