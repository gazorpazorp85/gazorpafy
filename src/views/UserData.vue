<template>
  <div class="flex column full user-info">
    <div
      v-for="playlist in userData"
      :key="playlist.id"
      class="flex column preview-container"
    >
      <UserDataSection :playlist="playlist" />
    </div>
  </div>
</template>

<script>

import UserDataSection from '@/cmps/UserDataContent';

export default {
  computed: {
    userData() {
      return this.$store.getters.userData;
    }
  },
  components: {
    UserDataSection
  }
}
</script>

<style>
</style>