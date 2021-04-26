<template>
  <div class="flex search-bar-container">
    <input
      class="searchInput"
      type="text"
      v-model="query"
      placeholder="Artists, songs, or podcasts"
      @keyup.13="search"
    />
    <span class="search-bar-icon"></span>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  data() {
    return {
      query: ''
    }
  },
  methods: {
    search() {
      const query = _.cloneDeep(this.query);
      this.$emit('search', query);
    }
  }
}
</script>