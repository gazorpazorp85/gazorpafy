<template>
  <div class="fans-container">
    <div
      v-for="artist in artists"
      :key="artist.id"
      class="flex column align-center card-container"
    >
      <img :src="artist.images[1].url" alt="" />
      <router-link :to="`/gazorpafy/artist/${artist.id}`">{{
        artist.name
      }}</router-link>
    </div>
  </div>
</template>

<script>
import { socketService } from '@/services/socket.service';

export default {
  props: {
    artists: {
      type: Array,
      required: true
    }
  }
}
</script>

<style>
</style>