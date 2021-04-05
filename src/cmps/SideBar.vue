<template>
  <div class="flex column side-bar-container">
    <h1>gazorpafy</h1>
    <img
      v-if="playerState"
      :src="playerState.albumImage.url"
      alt=""
      class="album-artwork"
    />
    <div v-else class="img-placeholder"></div>
  </div>
</template>

<script>
export default {
  computed: {
    playerState() {
      return this.$store.getters.playerState;
    },
  }
}
</script>

<style>
</style>