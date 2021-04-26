<template>
  <div class="flex cmps-nav-bar">
    <div
      v-for="endpoint in endpoints"
      :key="endpoint.name"
      :class="selected === endpoint.name ? 'active' : ''"
      @click="$emit('go', endpoint.name)"
    >
      {{ endpoint.title }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selected: {
      type: String,
      required: true
    },
    endpoints: {
      type: Array,
      required: true
    }
  }
}
</script>