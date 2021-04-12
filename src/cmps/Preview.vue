<template>
  <div class="flex column preview">
    <div
      class="preview-img-container"
      @mouseenter="isShownHandler(true)"
      @mouseleave="isShownHandler(false)"
    >
      <img v-if="item.images.length > 0" :src="item.images[0].url" />
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
      >{{ item.name }}
    </router-link>
    <div v-if="item.description" class="description">{{ longTxt }}</div>
    <div class="album-date" v-if="item.release_date">
      {{ item.release_date.substring(0, 4) }}
    </div>
  </div>
</template>

<script>

import { spotifyService } from '../services/spotify.service';

export default {
  props: {
    item: {
      type: Object,
      required: true
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
      console.log(this.item)
      try {
        const { deviceId, token } = this.$store.getters;
        if (this.item.type === 'playlist') {
          console.log('deviceId', deviceId);
          console.log('token', token);
          console.log('this.item.uri', this.item.uri);
          // await spotifyService.playTrack([this.item.uri], deviceId, token);
        } else {
          const { tracks } = await spotifyService.get(`${this.item.href}/top-tracks?market=IL`, token);
          const uris = tracks.map(track => track.uri);
          await spotifyService.playTrack(uris, deviceId, token);
          // console.log(uris)
        }
      } catch (err) {
        console.log('failed to play track', err);
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
    }
  }
}
</script>