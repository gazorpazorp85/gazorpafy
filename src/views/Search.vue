<template>
  <div class="search-container">
    <div class="main-container">
      <h1>Search</h1>
      <div v-if="results" class="main-container search-preview-container">
        <div v-for="(key, idx) in Object.keys(results)" :key="idx">
          <div class="flex category-title-container">
            <div class="category-title">{{ key }}</div>
            <div class="uppercase">see all</div>
          </div>
          <List :items="itemsToShow(results[key])" :type="key" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import List from '../cmps/List';

import { spotifyService } from '@/services/spotify.service';

export default {
  data() {
    return {
      results: null
    }
  },
  methods: {
    async search() {
      try {
        const { q } = this.$route.query;
        const { token } = this.$store.getters;
        const resultMap = await spotifyService.query(q, token);
        this.results = resultMap;
      } catch (err) {
        console.log('error while fetching query', err);
      }
    }
  },
  computed: {
    itemsToShow(result) {
      return result => {
        const items = JSON.parse(JSON.stringify(result));
        return items.slice(0, 4);
      }
    }
  },
  components: {
    List
  },
  created() {
    this.search();
  },
  watch: {
    '$route.query.q': function (to, from) {
      this.search();
    }
  },
}
</script>