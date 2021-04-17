<template>
  <div class="flex nav-bar">
    <div
      v-for="endpoint in endpoints"
      :key="endpoint.name"
      :class="name === endpoint.name ? 'active' : ''"
      @click="$emit('go', endpoint.name)"
    >
      {{ endpoint.title }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      endpoints: [
        { name: 'categories', title: 'genres & moods' },
        { name: 'newReleases', title: 'new releases' }
      ]
    }
  }
}
</script>