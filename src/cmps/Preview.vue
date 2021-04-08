<template>
  <router-link
    class="flex column preview"
    :to="{ path: `/gazorpafy/${item.type}/${item.id}` }"
  >
    <img v-if="item.images.length > 0" :src="item.images[0].url" />
    <div :class="`title ${item.type}`">{{ item.name }}</div>
    <div v-if="item.description" class="description">{{ longTxt }}</div>
    <div class="album-date" v-if="item.release_date">{{ item.release_date.substring(0, 4) }}</div>
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
      const { description } = this.item;
      return description.length > 45 ? description.substring(0, 45) + '...' : description;
    }
  }
}
</script>