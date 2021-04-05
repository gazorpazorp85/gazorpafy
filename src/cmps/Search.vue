<template>
  <div class="flex search-bar-container">
    <input
      type="text"
      v-model="query"
      placeholder="Artists, songs, or podcasts"
      @keyup.13="search"
    />
    <span class="search-bar-icon"></span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: ''
    }
  },
  methods: {
    search() {
      const query = JSON.parse(JSON.stringify(this.query));
      this.$emit('search', query);
    }
  }
}
</script>