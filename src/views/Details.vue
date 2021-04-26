<template>
  <div class="flex column details-container">
    <div class="main-container w100 h100">
      <template v-if="artist">
        <Header :artist="artist.artist" :endpoint="endpoint" />
        <Overview :artist="artist" v-if="endpoint === 'overview'" />
        <Fans v-else :artists="artist.artists" />
      </template>
      <div v-else class="flex center align-center h100">
        <img
          src="../assets/imgs/spinner.svg"
          alt=""
          :style="{ width: '15%' }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

import Fans from '@/cmps/Details/Fans';
import Header from '@/cmps/Details/Header';
import Overview from '@/cmps/Details/Overview';

import { spotifyService } from '@/services/spotify.service';
import { socketService } from '@/services/socket.service';

export default {
  data() {
    return {
      artist: null,
      endpoint: 'overview'
    }
  },
  methods: {
    async getArtistDetails() {
      try {
        const { token } = this.$store.getters;
        const { id } = this.$route.params;
        const artist = await spotifyService.getDetails(id, 'artists');
        const { items } = await spotifyService.get(`${artist.href}/albums?limit=50`, token);
        const albums = items.filter(item => item.available_markets.includes('IL'));
        const { artists } = await spotifyService.get(`${artist.href}/related-artists`, token);
        const { tracks } = await spotifyService.get(`${artist.href}/top-tracks?market=IL`, token);
        this.artist = { albums, artist, artists, tracks }
      } catch (err) {
        console.log('failed to get info', err);
      }
    },
    endpointHandler(value) {
      this.endpoint = value;
    }
  },
  components: {
    Fans,
    Header,
    Overview
  },
  created() {
    this.getArtistDetails();
    socketService.on('go', this.endpointHandler);
    console.log(this.$route);
  },
  destroyed() {
    socketService.off('go');
  },
  watch: {
    '$route.params.id': async function (to, from) {
      this.endpoint = 'overview';
      this.artist = null;
      console.log('this.artist', this.artist);
      await this.getArtistDetails();
      console.log('this.artist', this.artist);
    }
  }
}
</script>