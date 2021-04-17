<template>
  <section class="gazorpafy-container">
    <SideBar />
    <div class="main-content-container">
      <NavBar @search="search" />
      <router-view />
    </div>
    <Player />
  </section>
</template>

<script>
import NavBar from '@/cmps/NavBar';
import Player from '@/cmps/Player';
import SideBar from '@/cmps/SideBar';

import { spotifyService } from '@/services/spotify.service';

export default {
  name: 'GazorpafyApp',
  methods: {
    async search(query) {
      const { token } = this.$store.getters;
      const results = await spotifyService.query(query, token);
      console.log('query results', results);
    }
  },
  created() {
    this.$store.dispatch('getUserData');
  },
  components: {
    NavBar,
    Player,
    SideBar,
  }
}
</script>