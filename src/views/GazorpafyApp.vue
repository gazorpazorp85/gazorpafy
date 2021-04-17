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

import { spotifyService } from '@/services/spotify.service';

export default {
  name: 'GazorpafyApp',
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