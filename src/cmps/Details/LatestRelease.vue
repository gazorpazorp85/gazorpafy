<template>
  <div class="latest-release-container">
    <div class="capitalize title">latest release</div>
    <div class="flex">
      <img :src="album.images[0].url" alt="" />
      <div class="flex column center latest-release-info">
        <div class="title album">{{ album.name }}</div>
        <div class="uppercase">{{ formatedDate }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    album: {
      type: Object,
      required: true
    }
  },
  computed: {
    formatedDate() {
      const date = new Date(this.album.release_date);
      const year = date.toLocaleDateString('en-US', { year: 'numeric' });
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${year}`
    }
  }
}
</script>