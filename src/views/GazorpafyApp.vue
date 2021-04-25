<template>
  <section class="gazorpafy-container">
    <SideBar />
    <div class="main-content-container">
      <NavBar />
      <router-view />
    </div>
    <Player />
  </section>
</template>

<script>
import NavBar from '@/cmps/NavBar';
import Player from '@/cmps/Player';
import SideBar from '@/cmps/SideBar';

export default {
  name: 'GazorpafyApp',
  methods: {
    async getData() {
      await this.$store.dispatch('getUserData');
      await this.$store.dispatch('getRecommendations');
      await this.$store.dispatch('getFeaturedPlaylists');
    }
  },
  created() {
    this.getData();
  },
  components: {
    NavBar,
    Player,
    SideBar,
  }
}
</script>