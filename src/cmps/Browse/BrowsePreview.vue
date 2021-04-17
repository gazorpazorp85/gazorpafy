<template>
  <div class="flex column preview">
    <div class="preview-img-container">
      <img :src="item.icons[0].url" />
      <router-link
        :to="{
          name: `browseDetails`,
          params: { id: item.id, href: item.href, name: item.name },
        }"
        class="flex center align-center browse-category-name-container"
      >
        <div>{{ item.name }}</div>
      </router-link>
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
  }
}
</script>