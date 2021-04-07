<template>
  <div class="flex column full user-info">
    <div
      v-for="playlist in userData"
      :key="playlist.id"
      class="flex column cards-container"
    >
      <div class="flex align-center list-header">
        <div class="list-title">{{ playlist.title }}</div>
        <div class="navigation-container">
          <span @click="setIdx(-6, playlist)" class="material-icons">
            arrow_back_ios
          </span>
          <span @click="setIdx(6, playlist)" class="material-icons">
            arrow_forward_ios
          </span>
        </div>
      </div>
      <List :items="itemsToShow(playlist)" />
    </div>
  </div>
</template>

<script>

import List from '@/cmps/ListContainer/List';

export default {
  data() {
    return {
      idx: 0
    }
  },
  methods: {
    setIdx(value, playlist) {
      if (value < 0 && this.idx + value < 0) return;
      if (value > 0 && this.idx + value >= playlist.items.length) return;
      this.idx += value;
    }
  },
  computed: {
    itemsToShow(playlist) {
      return playlist => {
        const items = JSON.parse(JSON.stringify(playlist.items));
        return items.slice(this.idx, this.idx + 6);
      }
    },
    userData() {
      return this.$store.getters.userData;
    }
  },
  components: {
    List
  }
}
</script>

<style>
</style>