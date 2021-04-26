<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  created() {
    window.onSpotifyWebPlaybackSDKReady = () => {
      window.Spotify = Spotify;
    }
  }
}
</script>