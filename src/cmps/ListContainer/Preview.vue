<template>
  <router-link
    class="flex column card"
    :to="{ path: `gazorpafy/${item.type}/${item.id}` }"
  >
    <img v-if="item.images.length > 0" :src="item.images[0].url" />
    <div class="title">{{ item.name }}</div>
    <div v-if="item.description" class="description">{{ longTxt }}</div>
  </router-link>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    longTxt() {
      return this.item.description.length > 45 ? this.item.description.substring(0, 45) + '...' : this.item.description;
    }
  }
}
</script>

<style>
</style>