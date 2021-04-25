<template>
  <div class="flex search-preview">
    <div
      class="preview-img-container"
      @mouseenter="isShownHandler(true)"
      @mouseleave="isShownHandler(false)"
    >
      <img v-if="imageToRender" :src="imageToRender" />
      <div v-else :style="{ height: '75px', width: '75px' }">
        <div class="flex center align-center artist-icon">
          <span
            class="flex center align-center material-icons"
            :style="{ height: '75px', width: '75px', fontSize: '75px' }"
          >
            person_outline
          </span>
        </div>
      </div>
      <div
        v-if="isShown"
        class="flex center align-center preview-play-container"
      >
        <div class="flex center align-center play-btn-container" @click="play">
          <span class="material-icons"> play_arrow </span>
        </div>
      </div>
    </div>
    <div class="flex center column info-container">
      <router-link
        :to="{
          name: `${item.type === 'track' ? 'album' : item.type}`,
          params: getParams,
        }"
        :class="`title ${item.type}`"
      >
        {{ item.name }}
      </router-link>
      <!-- <div v-else :class="`title ${item.type}`">
        {{ item.name }}
      </div> -->
      <div class="info" v-if="item.artists">{{ item.artists[0].name }}</div>
      <div class="uppercase info" v-if="item.tracks">
        {{ item.tracks.total }} tracks
      </div>
    </div>
  </div>
</template>

<script>

import { spotifyService } from '@/services/spotify.service';
import { socketService } from '@/services/socket.service';

export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    isNewRelease: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      isShown: false
    }
  },
  methods: {
    isShownHandler(value) {
      this.isShown = value;
    },
    async play() {
      try {
        let uris = [];
        if (this.item.type === 'playlist') {
          const playlist = await spotifyService.getDetails(this.item.id, 'playlists');
          uris = playlist.tracks.items.map(({ track }) => track.uri);
        } else {
          const { token } = this.$store.getters;
          const { tracks } = await spotifyService.get(`${this.item.href}/top-tracks?market=IL`, token);
          uris = tracks.map(track => track.uri);
        }
        playerService.playHandler(this.$store.dispatch, this.$store.getters, uris);
      } catch (err) {
        console.log('can\'t play track from preview', err);
      }
    }
  },
  computed: {
    longTxt() {
      const { description } = this.item;
      return description.length > 45 ? description.substring(0, 45) + '...' : description;
    },
    getParams() {
      return this.item.type === 'album' ? { id: this.item.id, group: this.item.album_group, type: this.item.album_type } :
        this.item.type === 'track' ? { id: this.item.album.id, type: this.item.album.album_type } : { id: this.item.id };
    },
    imageToRender() {
      return this.item.images?.length > 0 ? this.item.images[0].url :
        this.item.album ? this.item.album.images[0].url : null;
    }
  }
}
</script>