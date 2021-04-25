<template>
  <div class="flex preview">
    <div
      class="preview-img-container"
      @mouseenter="isShownHandler(true)"
      @mouseleave="isShownHandler(false)"
    >
      <img v-if="imageToRender" :src="imageToRender" />
      <div
        v-if="isShown"
        class="flex center align-center preview-play-container"
      >
        <div class="flex center align-center play-btn-container" @click="play">
          <span class="material-icons"> play_arrow </span>
        </div>
      </div>
    </div>
    <router-link
      :to="{ name: `${item.type}`, params: getParams }"
      :class="`title ${item.type}`"
    >
      {{ item.name }}
    </router-link>
    <div v-if="item.description" class="description">{{ longTxt }}</div>
    <div class="album-info" v-if="isNewRelease">{{ item.artists[0].name }}</div>
    <div class="album-info" v-else-if="item.type === 'album'">
      {{ item.artists[0].name }}
    </div>
    <div class="album-info" v-else-if="item.release_date">
      {{ item.release_date.substring(0, 4) }}
    </div>
  </div>
</template>

<script>

import { playerService } from '@/services/player.service';
import { spotifyService } from '@/services/spotify.service';

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
      return this.item.type === 'album' ? { id: this.item.id, group: this.item.album_group, type: this.item.album_type } : { id: this.item.id };
    },
    imageToRender() {
      return this.item.images?.length > 0 ? this.item.images[0].url : this.item.album.images[0].url;
    }
  }
}
</script>