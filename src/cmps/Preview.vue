<template>
  <div class="flex column preview">
    <div
      class="preview-img-container"
      @mouseenter="isShownHandler(true)"
      @mouseleave="isShownHandler(false)"
    >
      <img v-if="item.images.length > 0" :src="item.images[0].url" />
      <div
        v-if="isShown"
        class="flex center align-center preview-play-container"
      >
        <div
          class="flex center align-center play-btn-container"
          @click="play"
        >
          <span class="material-icons"> play_arrow </span>
        </div>
      </div>
    </div>
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
  data() {
    return {
      isShown: false
    }
  },
  methods: {
    isShownHandler(value) {
      this.isShown = value;
    },
    play() {
      console.log(this.item.uri);
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