<template>
  <div class="main-container">
    <div class="browse-container preview-container">
      <h1 v-if="name">{{name}}</h1>
      <List v-if="items" :items="items" type="playlists" />
    </div>
  </div>
</template>

<script>

import List from '../List';

import { spotifyService } from '@/services/spotify.service';

export default {
  data() {
    return {
      items: null,
      name: null
    }
  },
  methods: {
    async getData() {
      try {
        const { token } = this.$store.getters;
        const { id } = this.$route.params;
        const url = `https://api.spotify.com/v1/browse/categories/${id}/playlists?country=IL`
        const { playlists } = await spotifyService.get(url, token);
        this.items = playlists.items;
      } catch (err) {
        console.log('error getting playlists in this category', err);
      }
    },
    async getName() {
      try {
        if (this.$route.params.name) {
          this.name = this.$route.params.name;
          return;
        }
        const { token } = this.$store.getters;
        const { id } = this.$route.params;
        const url = `https://api.spotify.com/v1/browse/categories/${id}`
        const { name } = await spotifyService.get(url, token);
        this.name = name;
      } catch (err) {
        console.log('error getting name', err);
      }
    },
  },
  components: {
    List
  },
  created() {
    this.getData();
    this.getName();
  }
}
</script>