<template>
  <div class="flex column full user-info">
    <div class="main-container w100">
      <h1>home</h1>
    </div>
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