<template>
  <div class="flex column preview">
    <img v-if="item.images.length > 0" :src="item.images[0].url" />
    <router-link
      :to="{ name: `${item.type}`, params: getParams }"
      :class="`title ${item.type}`"
      >{{ item.name }}
    </router-link>
    <div v-if="item.description" class="description">{{ longTxt }}</div>
    <div class="album-date" v-if="item.release_date">
      {{ item.release_date.substring(0, 4) }}
    </div>
  </div>
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
    },
    getParams() {
      return this.item.type === 'album' ? { id: this.item.id, group: this.item.album_group, type: this.item.album_type } : { id: this.item.id };
    }
  }
}
</script>