<template>
  <div class="flex column full user-info">
    <div
      v-for="playlist in userData"
      :key="playlist.id"
      class="flex column preview-container main-container"
    >
      <MainContent :playlist="playlist" />
    </div>
  </div>
</template>

<script>

import MainContent from '@/cmps/MainContent';

export default {
  computed: {
    userData() {
      return this.$store.getters.userData;
    }
  },
  components: {
    MainContent
  }
}
</script>

<style>
</style>